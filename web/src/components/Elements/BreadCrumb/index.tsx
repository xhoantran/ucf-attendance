import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

interface BreadCrumbProps {
  pages: {
    name: string;
    href: string;
    current: boolean;
  }[];
}

export const BreadCrumb = ({ pages }: BreadCrumbProps) => {
  const navigate = useNavigate();

  return (
    <nav className="flex pb-4" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-gray-500"
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </button>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <button
                onClick={() => navigate(page.href)}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
