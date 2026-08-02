import type { ImpactPreview } from "../../api/client";
import { useLanguage } from "../../hooks/useLanguage";
import { localizeDeep } from "../../lib/zhConvert";

const programmeDetailsCopy = {
  en: {
    where_needed_most: {
      focus: "the highest verified programme need at the next allocation review",
      access: "coach time, accessible venue use, participant transport, or urgent family support where current records show the clearest gap",
    },
    dance: {
      focus: "coached dance and creative movement delivery",
      access: "trained coaches, accessible rehearsal space, participant transport, performance preparation, and the support needed to join confidently",
    },
    sports: {
      focus: "supported sport and movement sessions",
      access: "qualified coaching, accessible venues, safe equipment, participant transport, and adaptations that keep the activity genuinely inclusive",
    },
    nutrition: {
      focus: "nutrition consultations and practical healthy-living workshops",
      access: "dietitian time, fresh ingredients, accessible learning materials, family follow-up, and the support needed to practise new habits at home",
    },
    family_support: {
      focus: "family and caregiver support",
      access: "case-worker time, transport, practical resources, counselling access, and follow-up for families navigating an immediate need",
    },
  },
  zh: {
    where_needed_most: {
      focus: "下次資源分配檢視時最迫切、已核實的服務需要",
      access: "教練時間、無障礙場地使用、參加者交通支援，或現有紀錄顯示最缺乏的緊急家庭支援",
    },
    dance: {
      focus: "有教練指導的舞蹈及創意動作課程",
      access: "受訓教練、無障礙排練場地、參加者交通支援、演出準備，以及讓參加者能自信參與所需的支援",
    },
    sports: {
      focus: "有支援的體育及體能活動",
      access: "合資格教練指導、無障礙場地、安全器材、參加者交通支援，以及讓活動真正共融的調適安排",
    },
    nutrition: {
      focus: "營養諮詢及實用健康生活工作坊",
      access: "營養師時間、新鮮食材、無障礙學習材料、家庭跟進，以及在家中實踐新習慣所需的支援",
    },
    family_support: {
      focus: "家庭及照顧者支援",
      access: "個案主任時間、交通、實務資源、輔導服務，以及為有即時需要的家庭提供跟進",
    },
  },
} as const;

const uiCopy = {
  en: {
    expectedWork: "Expected programme work",
    expectedWorkSuffix: (focus: string) => ` It is currently directed toward ${focus}.`,
    accessTitle: "What access may require",
    accessBody: (access: string) =>
      `The allocation can cover ${access}. These practical conditions are part of the impact, not overhead hidden from view.`,
    verifyTitle: "How Love 21 will verify it",
    verifyBody:
      "Attendance logs, coach or case-worker records, invoices, and consented photos are checked together. We will not publish a participant story or image without consent.",
    recordTitle: "When the record becomes real",
    recordBody:
      "After the programme cycle closes, the estimate is reconciled against delivered work. Identified donors receive the receipt, programme note, photographs where consented, and the verified outcome by email and in their profile.",
    timelineAria: "Expected reporting timeline",
    todayLabel: "Today",
    todayBody: "Gift intention and selected programme direction confirmed.",
    nextCycleLabel: "Next programme cycle",
    nextCycleBody: "Funds allocated alongside other gifts to scheduled delivery.",
    afterDeliveryLabel: "After delivery",
    afterDeliveryBody: "Programme team checks participation, spending and supporting records.",
    quarterCloseLabel: "Quarter close",
    quarterCloseBody: "Estimate replaced by the clearest verified account of what happened.",
    unitLabels: {
      dance_training_session: "coached dance training sessions",
      sports_session: "supported sports sessions",
      nutrition_consultation: "nutrition consultations",
      family_support_opportunity: "family support opportunities",
    } as Record<string, string>,
    fallbackUnitLabel: "programme opportunities",
    counted: (units: string, unitLabel: string) =>
      `The backend estimate associates this gift with approximately ${units} ${unitLabel}. The final record will use delivered activity, not this estimate.`,
    contribution:
      "This amount contributes toward the next complete unit of programme delivery. We will report the delivered work without rounding a partial contribution up into a result.",
    flexible:
      "This flexible gift will be assigned at the next allocation review to the highest verified need. The final record will identify the programme and delivered work rather than implying a result today.",
  },
  zh: {
    expectedWork: "預期的服務項目工作",
    expectedWorkSuffix: (focus: string) => `目前會投放於${focus}。`,
    accessTitle: "所需的實際支援",
    accessBody: (access: string) =>
      `此筆撥款可用於${access}。這些實際條件是成效的一部分，並非隱藏於背後的營運開支。`,
    verifyTitle: "Love 21 將如何核實",
    verifyBody:
      "出席紀錄、教練或個案主任紀錄、發票及已獲同意的相片，會一併被核對。未經參加者同意，我們不會公開其故事或影像。",
    recordTitle: "紀錄何時會確立",
    recordBody:
      "服務週期結束後，預算會與實際完成的工作對照核實。已登記身份的捐款人將透過電郵及其帳戶收到收據、服務項目說明、已獲同意的相片，以及核實後的成效。",
    timelineAria: "預期匯報時間表",
    todayLabel: "今天",
    todayBody: "確認捐款意向及所選的服務項目方向。",
    nextCycleLabel: "下一個服務週期",
    nextCycleBody: "款項會連同其他捐款一併分配至已排定的服務項目。",
    afterDeliveryLabel: "服務完成後",
    afterDeliveryBody: "服務團隊核對參與情況、開支及相關紀錄。",
    quarterCloseLabel: "季度結算",
    quarterCloseBody: "以最清晰、已核實的實際情況取代原先的預算。",
    unitLabels: {
      dance_training_session: "有教練指導的舞蹈訓練課堂",
      sports_session: "有支援的體育活動",
      nutrition_consultation: "營養諮詢",
      family_support_opportunity: "家庭支援機會",
    } as Record<string, string>,
    fallbackUnitLabel: "服務項目機會",
    counted: (units: string, unitLabel: string) =>
      `後台預算顯示此筆捐款約可支持 ${units} 次${unitLabel}。最終紀錄將以實際完成的活動為準，而非此預算。`,
    contribution:
      "此金額有助湊夠下一個完整的服務項目單位。我們將匯報實際完成的工作，而不會將部分貢獻無條件視為已達成的成果。",
    flexible:
      "此靈活捐款將於下次資源分配檢視時，分配至最迫切、已核實的需要。最終紀錄將列明所屬服務項目及實際完成的工作，而非現在就假設成效。",
  },
} as const;

export function DonationImpactBreakdown({ impact }: { impact: ImpactPreview }) {
  const { lang } = useLanguage();
  const key = lang === "en" ? "en" : "zh";
  const programmeDetails = localizeDeep(programmeDetailsCopy[key], lang);
  const copy = localizeDeep(uiCopy[key], lang);

  const programme = programmeDetails[impact.copy_key as keyof typeof programmeDetails]
    ?? programmeDetails.where_needed_most;

  function describeBackendEstimate(): string {
    if (impact.mode === "counted") {
      const unitLabel = copy.unitLabels[impact.unit_key] ?? copy.fallbackUnitLabel;
      return copy.counted(impact.estimated_units.toLocaleString("en-HK"), unitLabel);
    }
    if (impact.mode === "contribution") {
      return copy.contribution;
    }
    return copy.flexible;
  }

  return (
    <>
      <div className="donation-outcome-grid">
        <article><span>01</span><h4>{copy.expectedWork}</h4><p>{describeBackendEstimate()}{copy.expectedWorkSuffix(programme.focus)}</p></article>
        <article><span>02</span><h4>{copy.accessTitle}</h4><p>{copy.accessBody(programme.access)}</p></article>
        <article><span>03</span><h4>{copy.verifyTitle}</h4><p>{copy.verifyBody}</p></article>
        <article><span>04</span><h4>{copy.recordTitle}</h4><p>{copy.recordBody}</p></article>
      </div>
      <div className="donation-outcome-timeline" aria-label={copy.timelineAria}>
        <div><strong>{copy.todayLabel}</strong><span>{copy.todayBody}</span></div>
        <div><strong>{copy.nextCycleLabel}</strong><span>{copy.nextCycleBody}</span></div>
        <div><strong>{copy.afterDeliveryLabel}</strong><span>{copy.afterDeliveryBody}</span></div>
        <div><strong>{copy.quarterCloseLabel}</strong><span>{copy.quarterCloseBody}</span></div>
      </div>
    </>
  );
}
