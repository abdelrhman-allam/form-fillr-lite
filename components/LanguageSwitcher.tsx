"use client";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const router = useRouter();
  const switchLang = (lang: string) => {
    const path = window.location.pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${lang}${path}`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => switchLang("en")} className="text-sm">EN</button>
      <button onClick={() => switchLang("ar")} className="text-sm">AR</button>
    </div>
  );
}
