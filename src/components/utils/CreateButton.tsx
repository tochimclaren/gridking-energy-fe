import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const CreateButton = ({ link, text }: { link: string, text?: string }) => {
    return (
        <Link
        to={link}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm transition duration-200`}
      >
        <PlusCircle className="h-5 w-5" />
        <span>{text ? text : 'Create'}</span>
      </Link>
    )
}

export default CreateButton