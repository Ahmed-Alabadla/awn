import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Awn",
  description:
    "Find answers to common questions about the Awn announcement platform.",
};

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is this website?",
        answer:
          "This is an announcement platform that connects organizations with users. Organizations can post announcements about their activities, events, opportunities, and services, while users can browse, search, and save announcements that interest them.",
      },
      {
        question: "Who can use this website?",
        answer:
          "There are three types of users: Regular Users (can browse announcements, save favorites, and contact organizations), Organizations (can register, get verified, and post announcements), and Administrators (manage the platform, verify organizations, and moderate content).",
      },
    ],
  },
  {
    category: "For Regular Users",
    questions: [
      {
        question: "Do I need to register to browse announcements?",
        answer:
          "No, you can browse announcements without registration. However, registering allows you to save favorite announcements and receive notifications.",
      },
      {
        question: "How do I save announcements I'm interested in?",
        answer:
          "After registering and logging in, you can click the 'Add to Favorites' button on any announcement to save it to your favorites list for easy access later.",
      },
      {
        question: "How do I apply for opportunities posted by organizations?",
        answer:
          "Each announcement contains a direct link to the organization's application page or contact information. Click on the announcement link to be redirected to their official application process.",
      },
      {
        question: "Can I contact organizations directly?",
        answer:
          "Yes, you can use the support system to send messages to specific organizations or report any issues you encounter.",
      },
    ],
  },
  {
    category: "For Organizations",
    questions: [
      {
        question: "How do I register my organization?",
        answer:
          "Click 'Register as Organization' and provide your organization details. You'll need to upload verification documents including registration documents, financial reports, address proof, and activity proof.",
      },
      {
        question: "How long does verification take?",
        answer:
          "Admin review typically takes 3-5 business days. You'll receive a notification once your organization is verified or if additional documents are needed.",
      },
      {
        question: "Can I post announcements before verification?",
        answer:
          "You can create draft announcements, but they won't be published until your organization is verified and the announcements are approved by administrators.",
      },
      {
        question: "How do I create an announcement?",
        answer:
          "After verification: 1) Go to your organization dashboard, 2) Click 'Create New Announcement', 3) Fill in the title, description, dates, category, and upload an image, 4) Add the application/contact URL, 5) Submit for admin approval.",
      },
      {
        question: "Can I edit published announcements?",
        answer:
          "Yes, but changes to approved announcements require admin approval. Submit an edit request with your proposed changes, and an administrator will review them.",
      },
    ],
  },
  {
    category: "Content Guidelines",
    questions: [
      {
        question: "What types of announcements are allowed?",
        answer:
          "We accept announcements for job opportunities, volunteer positions, educational programs and training, events and workshops, scholarships and grants, community services, and internship programs.",
      },
      {
        question: "What content is not allowed?",
        answer:
          "Prohibited content includes fraudulent or misleading information, discriminatory content, commercial advertisements unrelated to legitimate opportunities, spam or duplicate postings, and content violating local laws.",
      },
      {
        question: "How are announcements moderated?",
        answer:
          "All announcements go through admin review before publication. Administrators check for accuracy, appropriateness, and compliance with platform guidelines.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I'm having trouble with the website. How can I get help?",
        answer:
          "Use the 'Help & Support' feature to report system issues, file complaints about organizations, request technical assistance, or provide feedback.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and follow the instructions sent to your registered email address.",
      },
      {
        question: "Can I change my profile information?",
        answer:
          "Yes, you can update your profile information, including your name, phone number, and profile picture, from your account settings.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we implement security measures to protect your personal information. We only share necessary information with organizations when you apply for their opportunities.",
      },
    ],
  },
  {
    category: "Getting Started",
    questions: [
      {
        question: "I'm new to the platform. Where should I start?",
        answer:
          "For Users: 1) Browse announcements on the homepage, 2) Use filters to find relevant opportunities, 3) Register to save favorites and get notifications. For Organizations: 1) Register your organization, 2) Upload required verification documents, 3) Wait for admin approval, 4) Start posting announcements.",
      },
      {
        question: "How do I stay updated with new announcements?",
        answer:
          "After registering, you'll receive notifications about new announcements in your areas of interest, updates from organizations you follow, and status changes on your applications.",
      },
      {
        question: "Can I suggest new features or improvements?",
        answer:
          "Absolutely! Use the support system to send your suggestions. We value user feedback and continuously work to improve the platform.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about the Awn platform. If you
            can&apos;t find what you&apos;re looking for, feel free to contact
            our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category) => (
            <Card key={category.category} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact our support team through the Help & Support section, and
              we&apos;ll be happy to assist you!
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
