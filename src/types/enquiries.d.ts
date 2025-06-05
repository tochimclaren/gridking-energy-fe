
interface Enquiry {
  _id: string,
  name: string;
  email: string;
  phone: string;
  interest: string;
  location: string;
  description: string;
  status: 'new' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}