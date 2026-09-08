import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  ClipboardCheck,
  Building2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_FULL_NAME, APP_NAME, INSTITUTION_NAME } from "@/constants";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure & Role-Based",
    description:
      "Authentication and role-based access control keep administrator and staff capabilities clearly separated.",
  },
  {
    icon: Users,
    title: "Centralized Staff Records",
    description:
      "Create, update, search, and filter staff records from a single, reliable source of truth.",
  },
  {
    icon: ClipboardCheck,
    title: "Approval Workflow",
    description:
      "Staff submit profile updates; administrators review, approve, or reject before records change.",
  },
  {
    icon: Building2,
    title: "Departments & Positions",
    description:
      "Manage departments and positions centrally, keeping every staff record consistently categorized.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt={INSTITUTION_NAME} width={32} height={32} className="rounded-sm" />
          <span className="font-semibold tracking-tight">{APP_NAME}</span>
        </div>
        <Button asChild size="sm">
          <Link href="/login">
            Sign up <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
          <Image
            src="/logo.jpeg"
            alt={`${INSTITUTION_NAME} crest`}
            width={88}
            height={88}
            className="rounded-md"
          />
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {INSTITUTION_NAME}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
            {APP_FULL_NAME}
          </h1>
          <p className="max-w-2xl text-balance text-muted-foreground md:text-lg">
            A modern, secure system for managing staff records — replacing
            paper-based processes with centralized records, role-based
            access, and a structured approval workflow.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Sign in to your account <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/30 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
              Built for a complete staff management workflow
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <Card key={f.title}>
                  <CardHeader>
                    <f.icon className="mb-2 size-6 text-primary" />
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        Developed for academic purposes as a case study of {INSTITUTION_NAME}.
      </footer>
    </div>
  );
}
