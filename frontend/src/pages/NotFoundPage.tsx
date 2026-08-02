import { Link } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

export function NotFoundPage() {
  const { lang } = useLanguage();

  return (
    <section className="not-found">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1>{lang === "en" ? "This path has not been added yet." : localizeDeep("此頁面尚未加入。", lang)}</h1>
        <p>{lang === "en" ? "Return to the community hub and choose another way in." : localizeDeep("返回社群中心，選擇其他路徑。", lang)}</p>
        <Link className="button button-dark" to="/">
          {lang === "en" ? "Back to home" : localizeDeep("返回首頁", lang)}
        </Link>
      </div>
    </section>
  );
}
