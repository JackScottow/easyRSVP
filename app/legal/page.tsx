"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LegalContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "terms";

  return (
    <main className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Legal Information</h1>

        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <section>
                  <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">By accessing and using EasyRSVP, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
                  <p className="text-muted-foreground">Permission is granted to temporarily use EasyRSVP for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Attempt to decompile or reverse engineer any software contained on EasyRSVP</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
                  <p className="text-muted-foreground">As a user of EasyRSVP, you agree to:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Use the service in compliance with all applicable laws</li>
                    <li>Not engage in any activity that disrupts or interferes with the service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">4. Disclaimer</h2>
                  <p className="text-muted-foreground">The materials on EasyRSVP are provided on an 'as is' basis. EasyRSVP makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">5. Limitations</h2>
                  <p className="text-muted-foreground">In no event shall EasyRSVP or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EasyRSVP.</p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <section>
                  <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                  <p className="text-muted-foreground">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Name and contact information</li>
                    <li>Account credentials</li>
                    <li>Event information and RSVP details</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Provide and maintain our services</li>
                    <li>Process your RSVPs and event management</li>
                    <li>Send you important updates and notifications</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">3. Information Sharing</h2>
                  <p className="text-muted-foreground">We do not sell or rent your personal information to third parties. We may share your information with:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Service providers who assist in operating our service</li>
                    <li>Event organizers for events you RSVP to</li>
                    <li>Law enforcement when required by law</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                  <p className="text-muted-foreground">We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
                  <p className="text-muted-foreground">You have the right to:</p>
                  <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
                  <p className="text-muted-foreground">If you have any questions about this Privacy Policy, please contact us at support@easyrsvp.com</p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LegalContent />
    </Suspense>
  );
}
