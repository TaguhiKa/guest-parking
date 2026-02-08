import type { IconType } from "react-icons";
import { BiCategoryAlt } from "react-icons/bi";

export const Nav = () => {
  return (
    <div className='space-y-1'>
      <Route Icon={BiCategoryAlt} selected={true} title='Overview' />
    </div>
  );
};

const Route = ({
  selected,
  Icon,
  title,
}: {
  selected: boolean;
  Icon: IconType;
  title: string;
}) => {
  return (
    <button
      className={`flex p-2 gap-2 w-full items-center md:justify-start justify-center rounded ${
        selected ? "text-accent" : "text-white"
      }`}
    >
      <Icon className='text-lg shrink-0' />
      <span className='hidden md:inline'>{title}</span>
    </button>
  );
};