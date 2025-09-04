"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-subtle-gradient py-20 lg:py-24">
      {/* <div className="fixed inset-0 bg-hero-gradient opacity-5 pointer-events-none"></div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Connecting
                <span className="block bg-hero-gradient bg-clip-text text-transparent">
                  Hearts & Hope
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Bridge the gap between aid-giving institutions and individuals
                in need. Together, we create a world where help reaches everyone
                who needs it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className=" text-white px-6 py-3 text-lg" variant="hero">
                Find an Aids
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="px-6 py-3 text-lg " variant="outline" asChild>
                <Link href="/register/#organization">Become a Partner →</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Institutions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">
                  People Helped
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$2M+</div>
                <div className="text-sm text-muted-foreground">
                  Aid Distributed
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative lg:pl-8">
            <div className="relative z-10 space-y-6">
              {/* Floating Cards */}
              <div className="bg-card p-6 rounded-xl shadow-card animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      Emergency Medical Aid
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Available 24/7
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="bg-card p-6 rounded-xl shadow-card animate-float ml-8"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      Verified Institutions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Trusted partners
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="bg-card p-6 rounded-xl shadow-card animate-float"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-glow/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      Community Support
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Stronger together
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-accent/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
