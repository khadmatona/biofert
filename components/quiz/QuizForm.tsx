"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { CheckIcon, ArrowIcon } from "@/components/ui/Icons";
import { UserInfoStep, type QuizUserInfo } from "./UserInfoStep";
import {
  quizQuestions,
  getQuizRecommendationKey,
  recommendationHrefs,
} from "@/lib/quiz-data";
import type { Locale } from "@/i18n/routing";
import quizContentFr from "@/content/quiz/fr.json";
import quizContentEn from "@/content/quiz/en.json";
import quizContentAr from "@/content/quiz/ar.json";

interface QuizContent {
  questions: Record<string, { question: string; options: Record<string, string> }>;
  recommendations: Record<string, { title: string; description: string }>;
}

const quizContent: Record<Locale, QuizContent> = {
  fr: quizContentFr,
  en: quizContentEn,
  ar: quizContentAr,
};

export function QuizForm() {
  const t = useTranslations("quiz");
  const locale = useLocale() as Locale;
  const content = quizContent[locale];

  const [userInfo, setUserInfo] = useState<QuizUserInfo | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionId] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const leadSavedRef = useRef(false);

  const visibleQuestions = useMemo(
    () => quizQuestions.filter((q) => !q.showIf || q.showIf(answers)),
    [answers]
  );

  const finished = stepIndex >= visibleQuestions.length;
  const currentQuestion = visibleQuestions[stepIndex];
  const progress = finished
    ? 100
    : Math.round((stepIndex / visibleQuestions.length) * 100);
  const recommendationKey = finished ? getQuizRecommendationKey(answers) : null;
  const recommendation = recommendationKey ? content.recommendations[recommendationKey] : null;

  useEffect(() => {
    if (!finished || !userInfo || !recommendation || leadSavedRef.current) return;
    leadSavedRef.current = true;

    // Reads the already-selected answer's display label straight from the
    // existing per-locale content — "" for a question skipped by showIf
    // (e.g. manCause when who="woman"), never a fabricated value.
    const answerLabel = (questionId: string) => {
      const answerKey = answers[questionId];
      if (!answerKey) return "";
      return content.questions[questionId]?.options[answerKey] ?? "";
    };

    fetch("/api/quiz-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        full_name: userInfo.fullName,
        phone: userInfo.phone,
        email: userInfo.email,
        age: answerLabel("age"),
        fertility_issue: answerLabel("who"),
        trying_duration: answerLabel("duration"),
        previous_pregnancy: answerLabel("pregnancy"),
        woman_situation: answerLabel("womanCause"),
        man_situation: answerLabel("manCause"),
        tests_diagnosis: answerLabel("exams"),
        main_goal: answerLabel("goal"),
        recommended_product_name: recommendation.title,
      }),
    }).catch(() => {
      // Lead capture is a side effect — a failed save must never block or
      // error out the user's quiz result.
    });
  }, [finished, userInfo, recommendation, answers, content, sessionId]);

  function selectOption(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
    leadSavedRef.current = false;
  }

  if (!userInfo) {
    return <UserInfoStep onSubmit={setUserInfo} />;
  }

  if (finished && recommendation) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          {t("resultReady")}
        </span>
        <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
          {t("weRecommend", { product: recommendation.title })}
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-ink/70">
          {recommendation.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={recommendationHrefs[recommendationKey!]} variant="primary" size="lg">
            {t("discover", { product: recommendation.title })}
          </Button>
          <Button href="/collections/best-sellers" variant="outline" size="lg">
            {t("viewAllProducts")}
          </Button>
        </div>
        <button
          type="button"
          onClick={restart}
          className="text-sm text-ink/50 underline underline-offset-4 hover:text-ink"
        >
          {t("restart")}
        </button>
      </div>
    );
  }

  const questionContent = content.questions[currentQuestion.id];

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink/50">
          <span>{t("questionOf", { current: stepIndex + 1, total: visibleQuestions.length })}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream" aria-hidden="true">
          <div
            className="h-full rounded-full bg-ink transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">
        {questionContent.question}
      </h2>

      <div role="radiogroup" aria-label={questionContent.question} className="flex flex-col gap-3">
        {currentQuestion.options.map((optionKey) => {
          const selected = answers[currentQuestion.id] === optionKey;
          return (
            <button
              key={optionKey}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectOption(currentQuestion.id, optionKey)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-start text-sm transition-colors ${
                selected
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-white text-ink hover:border-ink/40 hover:bg-cream"
              }`}
            >
              {questionContent.options[optionKey]}
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-cream bg-cream text-ink" : "border-ink/20"
                }`}
                aria-hidden="true"
              >
                {selected && <CheckIcon size={12} />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
          >
            <ArrowIcon direction="prev" size={14} />
            {t("back")}
          </button>
        ) : (
          <span />
        )}
        <Link href="/faq" className="text-xs text-ink/40 underline underline-offset-4 hover:text-ink/70">
          {t("needHelp")}
        </Link>
      </div>
    </div>
  );
}
