"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

function LegalContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "terms";

  return (
    <main className="container py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Legal Information</h1>
          <p className="text-muted-foreground text-center mt-3 max-w-2xl mx-auto">Please review our terms and privacy policy to understand how we operate and protect your information.</p>
        </div>

        <Tabs defaultValue={tab} className="w-full">
          <div className="mb-6 border-b">
            <TabsList className="w-full justify-start h-10 bg-transparent space-x-6 px-0">
              <TabsTrigger value="terms" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent px-2 pb-3 pt-2 font-medium rounded-none">
                Terms of Service
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent px-2 pb-3 pt-2 font-medium rounded-none">
                Privacy Policy
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="terms" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader className="bg-muted/50 pb-4">
                <CardTitle className="text-2xl">Terms of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">By accessing and using EasyRSVP, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                  <p className="text-muted-foreground leading-relaxed">Permission is granted to temporarily use EasyRSVP for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Attempt to decompile or reverse engineer any software contained on EasyRSVP</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                  <p className="text-muted-foreground leading-relaxed">As a user of EasyRSVP, you agree to:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Use the service in compliance with all applicable laws</li>
                    <li>Not engage in any activity that disrupts or interferes with the service</li>
                  </ul>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Disclaimer</h2>
                  <p className="text-muted-foreground leading-relaxed">The materials on EasyRSVP are provided on an 'as is' basis. EasyRSVP makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Limitations</h2>
                  <p className="text-muted-foreground leading-relaxed">In no event shall EasyRSVP or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EasyRSVP.</p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0">
            <Card className="border shadow-sm">
              <CardHeader className="bg-muted/50 pb-4">
                <CardTitle className="text-2xl">Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
                    <li>Name and contact information</li>
                    <li>Account credentials</li>
                    <li>Event information and RSVP details</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
                    <li>Provide and maintain our services</li>
                    <li>Process your RSVPs and event management</li>
                    <li>Send you important updates and notifications</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed">We do not sell or rent your personal information to third parties. We may share your information with:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
                    <li>Service providers who assist in operating our service</li>
                    <li>Event organizers for events you RSVP to</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
                  <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <div className="border-t my-4"></div>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at <span className="text-primary hover:underline">support@easyrsvp.com</span>
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>
    </main>
  );
}

export default function LegalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }>
      <LegalContent />
    </Suspense>
  );
}
