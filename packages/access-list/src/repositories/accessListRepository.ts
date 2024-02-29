import { getManager } from "typeorm";

export async function hasAccessToSomeEmployees(
  segmentReference: string,
  employeeReference: string[],
  addFormerEmployees: boolean,
): Promise<boolean> {
  const query = `SELECT true as granted
    FROM segments_employee_relation ser
    WHERE ser.segment_id = $2 AND ser.employee_id::text = ANY($1)
    ${
      addFormerEmployees
        ? `UNION
    SELECT true as granted
    FROM segments_attrition_employee_relation saer
    WHERE saer.segment_id = $2 AND saer.employee_id::text = ANY($1)
    `
        : ""
    };`;

  const response = (await getManager().query(query, [
    employeeReference,
    segmentReference,
  ])) as { granted?: boolean }[];

  return response[0]?.granted ?? false;
}
