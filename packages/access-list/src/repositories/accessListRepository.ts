import { getManager, SelectQueryBuilder } from "typeorm";
import { AccessListClient } from "..";

/**
 * Check access to list of employees
 * @param segmentReference the segment which wants to know if it has access to the employee
 * @param employeeReference list of employees
 * @param addFormerEmployees consider left employees
 * @returns true if segment reference can access to any of the employees on the list
 */
export async function hasAccessToSomeEmployees(
  segmentReference: string,
  employeeReference: string[],
  addFormerEmployees: boolean
): Promise<boolean> {
  const query = `SELECT bool_or(true) as granted
    FROM segments_employee_relation_with_attrition ser
    WHERE ser.segment_id = $2 AND ser.employee_id::text = ANY($1)
    ${addFormerEmployees ? "" : " AND left_organization_at IS NULL"};`;

  const response = (await getManager().query(query, [
    employeeReference,
    segmentReference,
  ])) as { granted?: boolean }[];

  return response[0]?.granted ?? false;
}

/**
 * Check which employees the segment has access from a given list
 * @param segmentReference the segment which wants to know if it has access to the employee
 * @param employeeReference list of employees
 * @param addFormerEmployees consider left employees
 * @returns true if segment reference can access to any of the employees on the list
 */
export async function whichEmployeesHasAccessTo(
  segmentReference: string,
  employeeReference: string[],
  addFormerEmployees: boolean
): Promise<string[]> {
  const query = `SELECT ser.employee_id as employee_id
    FROM segments_employee_relation_with_attrition ser
    WHERE ser.segment_id = $2 AND ser.employee_id::text = ANY($1)
    ${addFormerEmployees ? "" : " AND left_organization_at IS NULL"};`;

  const response = (await getManager().query(query, [
    employeeReference,
    segmentReference,
  ])) as { employee_id: string }[];

  return response.map((e) => e.employee_id);
}

/**
 * Get the full access list of employees from a segment
 * @param segmentReference the segment which wants to know if it has access to the employee
 * @param employeeReference list of employees
 * @param addFormerEmployees consider left employees
 * @returns true if segment reference can access to any of the employees on the list
 */
export async function getFullAccessList(
  segmentReference: string,
  addFormerEmployees: boolean
): Promise<string[]> {
  const query = `SELECT ser.employee_id as employee_id
    FROM segments_employee_relation_with_attrition ser
    WHERE ser.segment_id = $1
    ${addFormerEmployees ? "" : " AND left_organization_at IS NULL"};`;

  const response = (await getManager().query(query, [segmentReference])) as {
    employee_id: string;
  }[];

  return response.map((e) => e.employee_id);
}

/**
 * Adds accessList filters to a given queryBuilder. Should be called at the end, or at least
 * after the first where is set to the queryBuilder.
 * @param queryBuilder The query to be filtered with accessList
 * @param segmentId The segment from which the accessList is calculated.
 * @param fullEmployeeReferenceFieldName The alias and name of the field that has the employee reference
 * @returns a query builder with accessList filters
 */
export function addFiltersToSelectQuery<T>(
  queryBuilder: SelectQueryBuilder<T>,
  accessList: AccessListClient,
  fullEmployeeReferenceFieldName: string,
  segmentParamAlias = "segmentId",
  subTableAlias?: string,
  segmentReference?: string
): SelectQueryBuilder<T> {
  if (accessList.hasAccessToAll() && !segmentReference) return queryBuilder;

  let segmentReferenceParam = segmentReference;
  if (!segmentReferenceParam) {
    segmentReferenceParam = accessList.getSegmentReferenceOrFail();
  }

  const subTable = subTableAlias ?? "ser";

  const query = `(SELECT employee_id
    FROM public.segments_employee_relation_with_attrition
    WHERE segment_id = :${segmentParamAlias}
    ${
      accessList.shouldAddFormerEmployees()
        ? ""
        : "AND left_organization_at IS NULL"
    })`;

  return queryBuilder.innerJoin(
    query,
    subTable,
    `${subTable}.employee_id::text = ${fullEmployeeReferenceFieldName}`,
    {
      [segmentParamAlias]: segmentReferenceParam,
    }
  );
}

export function getSQLJoinFilters(
  accessList: AccessListClient,
  fullEmployeeReferenceFieldName: string,
  segmentReferenceIndex: string,
  subTableAlias?: string
): string {
  if (!segmentReferenceIndex.includes("$")) {
    throw new Error(
      "getSQLJoinFilters#segmentReferenceIndex param should be an index"
    );
  }
  const subTable = subTableAlias ?? "ser";

  return `JOIN (SELECT employee_id
    FROM public.segments_employee_relation_with_attrition
    WHERE segment_id = ${segmentReferenceIndex}
    ${
      accessList.shouldAddFormerEmployees()
        ? ""
        : "AND left_organization_at IS NULL"
    }) ${subTable} on ${subTable}.employee_id = ${fullEmployeeReferenceFieldName}`;
}
