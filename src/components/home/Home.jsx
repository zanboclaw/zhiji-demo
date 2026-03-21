import { HomeHeroSection } from './HomeHeroSection'
import { Text2BTSection } from './Text2BTSection'
import {
  CapabilitiesSection,
  FinalCtaSection,
  PartnershipSection,
  PricingSection,
  WorkflowSection,
} from './HomeSections'

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeroSection />
      <CapabilitiesSection />
      <Text2BTSection />
      <WorkflowSection />
      <PricingSection />
      <PartnershipSection />
      <FinalCtaSection />
    </div>
  )
}
