import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// TestimonialCard Component
export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
  className?: string;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export function TestimonialCard({
  author,
  text,
  href,
  className,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border border-white/10",
        "bg-gradient-to-b from-white/10 to-white/5",
        "p-4 text-start sm:p-6",
        "hover:from-white/20 hover:to-white/10",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        "backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>
            {author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-white">
            {author.name}
          </h3>
          <p className="text-sm text-white/70">{author.handle}</p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-white/80">{text}</p>
    </Card>
  );
}

// TestimonialsSection Component
interface TestimonialsSectionProps {
  title: string;
  description: string;
  testimonials: Array<{
    author: TestimonialAuthor;
    text: string;
    href?: string;
  }>;
  className?: string;
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        "bg-transparent text-white",
        "py-0 px-4",
        className
      )}
    >
              <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-6">
        {(title || description) && (
          <div className="flex flex-col items-center gap-4 px-4 sm:gap-6">
            {title && (
              <h2 className="max-w-[720px] text-3xl font-semibold leading-tight text-white sm:text-4xl sm:leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-md max-w-[600px] font-medium text-white/80 sm:text-lg">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:60s]">
            <div className="flex shrink-0 [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(8)].map((_, setIndex) =>
                testimonials.map((testimonial, i) => (
                  <TestimonialCard key={`${setIndex}-${i}`} {...testimonial} />
                ))
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black/80 to-transparent" />
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - var(--gap) / 2));
          }
        }

        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
        }
      `}</style>
    </section>
  );
}

// 示例数据
export const defaultTestimonials = [
  {
    author: {
      name: "Sarah Chen",
      handle: "@sarahcodes",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "Found my dream job in just 2 weeks! The personalized job matching feature is incredibly accurate and saved me so much time.",
    href: "https://twitter.com/sarahcodes",
  },
  {
    author: {
      name: "Michael Zhang",
      handle: "@mikedev",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "As a recruiter, this platform has revolutionized our hiring process. We've filled 80% more positions with higher quality candidates.",
    href: "https://twitter.com/mikedev",
  },
  {
    author: {
      name: "Lisa Wang",
      handle: "@lisatech",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    text: "The interview preparation tools and company insights helped me land a senior role at my target company. Absolutely game-changing!",
  },
  {
    author: {
      name: "David Kim",
      handle: "@daviddev",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    text: "The AI matching algorithm is incredibly precise, all recommended positions align perfectly with my skills and expectations. Highly recommend!",
  },
  {
    author: {
      name: "Emma Rodriguez",
      handle: "@emmahr",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    text: "From resume optimization to interview tips, the resources here helped me successfully transition into the tech industry. Thank you so much!",
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jameswilson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    text: "Company culture reviews and salary transparency allow me to make informed career choices. This is a blessing for job seekers.",
  }
];
