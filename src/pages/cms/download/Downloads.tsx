import { useLocation } from "react-router-dom";
import DownloadManager from "../../../components/cms/download/DownloadManager"
import { toast } from "react-toastify";


const Downloads = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const location = useLocation()
    const { refModel, refId } = location.state?.data || {}

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
        <>
            {refModel && refId ?
                <div className="w-full">
                    <DownloadManager
                        apiUrl={`${BASE_URL}/download`}
                        refId={refId}
                        refModel={refModel}
                        onSuccess={handleSuccess}
                    />
                </div>
                :
                <div className="w-full">
                    <DownloadManager apiUrl={`${BASE_URL}/download`} onSuccess={handleSuccess}/>
                </div>
            }

        </>
    )

}

export default Downloads