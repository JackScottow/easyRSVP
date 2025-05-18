import Link from "next/link";
import { Calendar } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex items-center gap-4 px-4 md:h-24 md:flex-row">
        <div className="flex flex-1 items-center justify-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">EasyRSVP</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 text-xs md:text-sm">
          <Link href="/legal" className="hover:underline">
            Terms
          </Link>
          <Link href="/legal?tab=privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
        <div className="flex-1 text-center text-muted-foreground text-xs md:text-sm">©easyRSVP {new Date().getFullYear()}</div>
        {/* <p className="text-sm text-muted-foreground flex-1 text-center">©  EasyRSVP. All rights reserved.</p> */}
      </div>
    </footer>
  );
}
