import { merge } from "lodash";
import { AuditBody } from "./interfaces";
import { Audit } from "./audit";

export class AuditWithState {
  public audit: Audit;

  public additions: Partial<AuditBody>;

  constructor(audit: Audit) {
    this.audit = audit;
    this.additions = {};
  }

  public log(body: Partial<AuditBody>): void {
    const completeBody = this.merge(body) as AuditBody;
    this.audit.log(completeBody);
  }

  public add(body: Partial<AuditBody>): void {
    this.additions = this.merge(body);
  }

  public merge(body: Partial<AuditBody>): Partial<AuditBody> {
    return merge(this.additions, body);
  }
}
