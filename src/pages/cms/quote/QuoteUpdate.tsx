import { toast } from 'react-toastify'
import QuoteForm from '../../../components/cms/quote/QuoteForm'
import { useLocation } from 'react-router-dom'

const QuoteUpdate = () => {
    const location = useLocation()
    const quote = location.state?.quote

      const handleSuccess = () => {
        toast.success('Success!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      };


    return (
        <div className="w-full max-w-full overflow-x-auto">
            <QuoteForm quoteId={quote._id} onSuccess={handleSuccess}/>
        </div>
    )
}

export default QuoteUpdate