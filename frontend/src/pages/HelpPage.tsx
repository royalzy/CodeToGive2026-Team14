import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { SectionHeading, StatusPanel } from "../components/Cards";
import { Field } from "../components/FormControls";
import { SupportFinder } from "../components/help/SupportFinder";
import { type SupportAnswers } from "../content/support";
import { useLanguage } from "../hooks/useLanguage";
import { localizeDeep } from "../lib/zhConvert";

const helpCopy = {
  en: {
    finderEyebrow: "You are not alone",
    finderTitle: "Let us find a starting point together",
    finderBody: "Three short questions, no wrong answers.",
    asideEyebrow: "Book a conversation",
    asideTitle: "Request support",
    asideBody:
      "Tell us a little about what you need. The Love 21 team would reach out to schedule a time that works for you.",
    successTitle: "Your support request has been received.",
    successBody:
      "In a live service, the Love 21 team would contact you within two working days to arrange a conversation.",
    exploreLink: "Explore our programmes",
    formEyebrow: "Support booking",
    formTitle: "Tell us about your needs",
    nameLabel: "Your name",
    emailLabel: "Email",
    phoneLabel: "Phone (optional)",
    preferredLabel: "Preferred time",
    selectOption: "Select an option",
    weekdays: "Weekdays",
    evenings: "Evenings",
    weekends: "Weekends",
    messageLabel: "What would you like to discuss? (optional)",
    messageHint: "Please do not include sensitive personal information.",
    sending: "Sending…",
    send: "Send request",
    errors: {
      name: "Please enter your name.",
      email: "Enter a valid email address.",
      preferred: "Please choose a time.",
      message: "Keep your message under 500 characters.",
    },
  },
  zh: {
    finderEyebrow: "你並不孤單",
    finderTitle: "讓我們一起找到起點",
    finderBody: "三條簡短問題，沒有對錯答案。",
    asideEyebrow: "預約傾談",
    asideTitle: "申請支援",
    asideBody: "告訴我們一點你的需要。Love 21 團隊會聯絡你，安排合適的時間。",
    successTitle: "我們已收到你的支援申請。",
    successBody: "在正式服務中，Love 21 團隊會於兩個工作天內聯絡你，安排傾談時間。",
    exploreLink: "探索我們的活動",
    formEyebrow: "支援預約",
    formTitle: "告訴我們你的需要",
    nameLabel: "你的姓名",
    emailLabel: "電郵",
    phoneLabel: "電話（可選）",
    preferredLabel: "偏好時間",
    selectOption: "請選擇",
    weekdays: "平日",
    evenings: "晚間",
    weekends: "週末",
    messageLabel: "你想討論甚麼？（可選）",
    messageHint: "請勿包含敏感個人資料。",
    sending: "傳送中…",
    send: "傳送申請",
    errors: {
      name: "請輸入你的姓名。",
      email: "請輸入有效的電郵地址。",
      preferred: "請選擇時間。",
      message: "留言請保持在 500 字以內。",
    },
  },
} as const;

type BookingFormData = {
  name: string;
  email: string;
  phone?: string;
  preferred: "weekday" | "weekend" | "evening";
  message?: string;
};

export function HelpPage() {
  const { lang } = useLanguage();
  const copy = localizeDeep(helpCopy[lang === "en" ? "en" : "zh"], lang);
  const [result, setResult] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const bookingSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, copy.errors.name).max(80),
        email: z.string().email(copy.errors.email),
        phone: z.string().max(20).optional(),
        preferred: z.enum(["weekday", "weekend", "evening"], {
          error: copy.errors.preferred,
        }),
        message: z.string().max(500, copy.errors.message).optional(),
      }),
    [copy],
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", phone: "", preferred: undefined, message: "" },
  });

  /**
   * Carry the finder's answers into the message box so nobody has to retype
   * what they just told us. Anything already typed is left alone.
   */
  function prefillMessage(_answers: SupportAnswers, summary: string) {
    if (getValues("message")?.trim()) return;
    setValue("message", summary);
  }

  function onSubmit() {
    setSubmitError(null);
    setResult(true);
  }
  return (
    <>
      <section className="section">
        <div className="shell help-finder">
          <SectionHeading
            eyebrow={copy.finderEyebrow}
            title={copy.finderTitle}
            body={copy.finderBody}
          />
          <SupportFinder onComplete={prefillMessage} />
        </div>
      </section>

      {/* The support finder links here with #support-request. */}
      <section className="section form-section" id="support-request">
        <div className="shell form-layout">
          <aside className="form-aside">
            <p className="eyebrow">{copy.asideEyebrow}</p>
            <h2>{copy.asideTitle}</h2>
            <p>{copy.asideBody}</p>
          </aside>

          <div className="form-card">
            {result ? (
              <StatusPanel title={copy.successTitle} tone="success">
                <p>{copy.successBody}</p>
                <Link className="button button-dark" to="/story">
                  {copy.exploreLink}
                </Link>
              </StatusPanel>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-heading">
                  <p>{copy.formEyebrow}</p>
                  <h2>{copy.formTitle}</h2>
                </div>

                {submitError && (
                  <div className="form-alert" role="alert">
                    {submitError}
                  </div>
                )}

                <div className="two-column-fields">
                  <Field label={copy.nameLabel} error={errors.name?.message}>
                    <input autoComplete="name" {...register("name")} />
                  </Field>
                  <Field label={copy.emailLabel} error={errors.email?.message}>
                    <input type="email" autoComplete="email" {...register("email")} />
                  </Field>
                </div>

                <Field label={copy.phoneLabel} error={errors.phone?.message}>
                  <input type="tel" autoComplete="tel" {...register("phone")} />
                </Field>

                <Field label={copy.preferredLabel} error={errors.preferred?.message}>
                  <select defaultValue="" {...register("preferred")}>
                    <option value="" disabled>
                      {copy.selectOption}
                    </option>
                    <option value="weekday">{copy.weekdays}</option>
                    <option value="evening">{copy.evenings}</option>
                    <option value="weekend">{copy.weekends}</option>
                  </select>
                </Field>

                <Field
                  label={copy.messageLabel}
                  error={errors.message?.message}
                  hint={copy.messageHint}
                >
                  <textarea rows={4} {...register("message")} />
                </Field>

                <button
                  className="button button-dark button-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? copy.sending : copy.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
