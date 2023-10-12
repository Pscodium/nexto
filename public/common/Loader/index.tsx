import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#000"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
            />
        </div>
    );
};

export default Loader;
