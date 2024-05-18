import { SlashIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {} from "next/navigation";
import { useParams } from "next/navigation";
export function BreadCrumb() {
  // Base on the current pathname, we can determine the current page
  const pathname = usePathname();
  console.log(pathname);

  return (
    <>
      {pathname !== "/" && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {pathname.includes("/trips") && (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/trips">My Trips</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            {pathname.includes("/trips/") && (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {pathname.split("/")[2].charAt(0).toUpperCase() +
                      pathname.split("/")[2].slice(1)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  );
}
