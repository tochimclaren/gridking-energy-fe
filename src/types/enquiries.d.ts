
interface Enquiry  {
    _id: string,
    name: string,
    email: string,
    phone: string,
    subject: string,
    country: string,
    state: string,
    message: string,
    status?: 'new' | 'in-progress' | 'completed',
    priority?: 'low' | 'medium' | 'high'
}