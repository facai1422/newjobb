'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mail as MailIcon, MessageCircle as WhatsAppIcon, Send as TelegramIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSectionType {
	label: string;
	links: FooterLink[];
}

const defaultFooterLinks: FooterSectionType[] = [
    {
        label: 'Company',
        links: [
            { title: 'Features', href: '#features' },
            { title: 'FAQs', href: '/faqs' },
            { title: 'Pricing', href: '#pricing' },
            { title: 'About Us', href: '/about' },
            { title: 'Testimonials', href: '/testimonials' },
        ],
    },
    {
        label: 'Contact',
        links: [
            { title: 'WhatsApp', href: '#', icon: WhatsAppIcon },
            { title: 'Telegram', href: '#', icon: TelegramIcon },
            { title: 'Email', href: 'mailto:', icon: MailIcon },
        ],
    },
];

export function Footer() {
    const [whatsapp, setWhatsapp] = React.useState<string>('');
    const [telegram, setTelegram] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');

    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('customer_service_settings')
                    .select('*')
                    .limit(1)
                    .maybeSingle();
                if (data) {
                    setWhatsapp((data as any).whatsapp_link || '');
                    setTelegram((data as any).telegram_link || '');
                    setEmail((data as any).email || '');
                }
            } catch {
                // ignore
            }
        })();
    }, []);

    const footerLinks: FooterSectionType[] = React.useMemo(() => {
        const contactLinks: FooterLink[] = [
            { title: 'WhatsApp', href: whatsapp || '#', icon: WhatsAppIcon },
            { title: 'Telegram', href: telegram || '#', icon: TelegramIcon },
            { title: 'Email', href: email ? `mailto:${email}` : 'mailto:', icon: MailIcon },
        ];
        return defaultFooterLinks.map((s) => s.label === 'Contact' ? ({ ...s, links: contactLinks }) : s);
    }, [whatsapp, telegram, email]);

    return (
        <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-white/10 bg-zinc-950 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.12),transparent)] px-6 pt-4 pb-12 lg:pt-6 lg:pb-16 text-white">
            <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur bg-white/20" />

			<div className="grid w-full gap-4">
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xs text-white/80">{section.label}</h3>
                                <ul className="mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
                                                className="inline-flex items-center transition-all duration-300 text-white/70 hover:text-white"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
							</ul>
						</div>
					</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <>{children}</>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}


