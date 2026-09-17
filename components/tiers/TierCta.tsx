import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SelectPlanButton } from "@/components/servicios/PlanSelection";
import { buttonClass } from "@/components/ui/button";
import { calUrl } from "@/lib/links";
import { TIER_CTA, type Tier } from "@/lib/tiers";

// A plan's own call to action (label and action from TIER_CTA). The
// recommended plan gets the filled button so the three don't carry equal
// weight. On /servicios `select` preselects the plan in the form on the same
// page; elsewhere the form action links there.
export function TierCta({
  tier,
  location,
  mode,
  size = "md",
  className,
}: {
  tier: Tier;
  location: string;
  mode: "link" | "select";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { label, action } = TIER_CTA[tier.slug];
  const cls = buttonClass(tier.recommended ? "primary" : "secondary", size, className);

  if (action === "call") {
    return (
      <TrackedLink href={calUrl(tier)} event="cal_click" location={location} plan={tier.slug} className={cls}>
        {label}
      </TrackedLink>
    );
  }
  if (mode === "select") {
    return (
      <SelectPlanButton slug={tier.slug} source={location} className={cls}>
        {label}
      </SelectPlanButton>
    );
  }
  return (
    <Link href={`/servicios?plan=${tier.slug}#elegir-plan`} className={cls}>
      {label}
    </Link>
  );
}
