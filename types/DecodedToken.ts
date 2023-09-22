import { Role } from "@prisma/client";

export default interface DecodedToken {
  id: string;
  role: Role;
}
