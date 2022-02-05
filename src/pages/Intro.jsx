import intro from '../assets/images/intro.jpg';
import { useSelector } from 'react-redux';

export default function Intro() {
  const pageRendered = useSelector((state) => state.chatState.pageRendered);

  return pageRendered ? (
    <main
      className="relative flex justify-center h-full text-gray-500 select-none"
      style={{ minWidth: '400px' }}
    >
      <img
        src={intro}
        alt=""
        className="object-cover w-full h-full shadow-md rounded-br-md rounded-tr-3xl"
      />
      <div className="absolute text-5xl bottom-20">Whoosapp</div>
    </main>
  ) : null;
}
