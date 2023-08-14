
interface SvgProps {
    color: string;
}

export default function IconManipulator({ color }: SvgProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" style={{ fill: color }} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enableBackground="new 0 0 100 100" xmlSpace="preserve">
            <path d="M49.901,10.235C33.387,10.235,20,23.623,20,40.137C20,64,50,90,50,90s30-26,29.804-49.863  C79.668,23.624,66.416,10.235,49.901,10.235z M64,40c0,7.732-6.268,14-14,14c-7.732,0-14-6.268-14-14s6.268-14,14-14  C57.732,26,64,32.268,64,40z"/>
        </svg>
    );
}