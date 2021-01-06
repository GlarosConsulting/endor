export default interface ICreateEmployeeDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
  company_id: string;
}
