import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";
import {Link} from "react-router";
const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
           
            <Navbar />

           <section className="main-section pt-10 px-4 sm:px-6 lg:px-8">
    <div className="page-heading flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-16 xl:gap-40">
        <div className="w-full lg:w-auto lg:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Smart feedback for your dream job
            </h1>
            {isProcessing ? (
                <>
                    <h2 className="text-lg sm:text-xl mb-4">{statusText}</h2>
                    <img 
                        src="/images/resume-scan.gif" 
                        className="w-full max-w-md mx-auto lg:mx-0" 
                        alt="Processing resume"
                    />
                </>
            ) : (
                <h2 className="text-base sm:text-lg text-gray-600">
                    Drop your resume for an ATS score and improvement tips
                </h2>
            )}
        </div>
        
        {!isProcessing && (
            <form 
                id="upload-form" 
                onSubmit={handleSubmit} 
                className="w-full lg:w-auto lg:min-w-96 flex flex-col gap-4 mt-6 lg:mt-0"
            >
                <div className="form-div">
                    <label 
                        htmlFor="job-title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Job Title
                    </label>
                    <input 
                        type="text" 
                        name="job-title" 
                        placeholder="e.g. Software Engineer" 
                        id="job-title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div className="form-div">
                    <label 
                        htmlFor="job-description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Job Description
                    </label>
                    <textarea 
                        rows={3} 
                        name="job-description" 
                        placeholder="Paste the job requirements here..." 
                        id="job-description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    />
                </div>

                <div className="form-div">
                    <label 
                        htmlFor="uploader"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Upload Resume
                    </label>
                    <FileUploader onFileSelect={handleFileSelect} />
                </div>

                <button 
                    className="primary-button w-full py-3 px-4 text-base font-medium" 
                    type="submit"
                >
                    Analyze Resume
                </button>
            </form>
        )}
    </div>
</section>

        </main>
    )
}
export default Upload
