import Contacts from './Contacts';
import Header from './Header';

export default function Left() {
  return (
    <div className="z-10 hidden border-r shadow-lg md:block lg:w-96 md:w-80 sm:block rounded-bl-md rounded-tl-md bg-blue-50">
      <Header />
      <Contacts />
    </div>
  );
}
