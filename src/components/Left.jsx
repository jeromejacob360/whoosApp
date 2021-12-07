import Contacts from './Contacts';
import Header from './Header';

export default function Left() {
  return (
    <div className="z-10 border-r shadow-lg lg:w-96 md:w-80 sm:w-72 rounded-bl-md rounded-tl-md bg-blue-50">
      <Header />
      <Contacts />
    </div>
  );
}
