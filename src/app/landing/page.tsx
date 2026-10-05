"use client";
import { motion } from "framer-motion";
import Logo from "@/assets/Logo";
import Link from "next/link";
import {
	IconMessageCircle,
	IconLock,
	IconBolt,
	IconSparkles,
	IconArrowRight,
	IconUsers,
	IconWorld,
	IconDeviceMobile,
	IconCircleCheck,
	IconStar,
	IconTrendingUp,
	IconBrandNextjs,
	IconBrandSupabase,
	IconBrandTailwind,
	IconBrandTypescript,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function page() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.5 },
		},
	};

	const features = [
		{
			icon: IconMessageCircle,
			title: "Real-time Chat",
			desc: "Experience instant messaging with zero delays. Connect with friends and colleagues seamlessly.",
		},
		{
			icon: IconLock,
			title: "Secure & Private",
			desc: "Your conversations are protected with end-to-end encryption. Privacy is our priority.",
		},
		{
			icon: IconBolt,
			title: "Lightning Fast",
			desc: "Optimized for peak performance. Send messages, share files, and stay connected instantly.",
		},
	];

	const benefits = [
		{
			icon: IconUsers,
			title: "Group Chats",
			desc: "Create unlimited group conversations",
		},
		{
			icon: IconWorld,
			title: "Global Access",
			desc: "Connect from anywhere in the world",
		},
		{
			icon: IconDeviceMobile,
			title: "Cross-Platform",
			desc: "Works seamlessly on all devices",
		},
	];

	return (
		<div className="h-full bg-background overflow-y-scroll">
			<div className="flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32">
				{/* Navbar */}
				<nav className="w-full flex justify-between items-center py-6 mb-4">
					<motion.div
						className="flex items-center gap-3 justify-center"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Logo className="h-8 w-8" />
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">
							Milaap
						</h1>
						<Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
							<IconSparkles className="w-3 h-3 mr-1" />
							Beta
						</Badge>
					</motion.div>
					<motion.div
						className="flex items-center gap-3"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Button
							variant="ghost"
							size="sm"
							nativeButton={false}
							render={<Link href="/auth">Login</Link>}
						></Button>
						<Button
							size="sm"
							nativeButton={false}
							render={
								<Link href="/auth">
									Sign Up <IconArrowRight className="ml-2" size={16} />
								</Link>
							}
						></Button>
					</motion.div>
				</nav>

				{/* Hero Section */}
				<motion.div
					className="flex flex-col items-center text-center max-w-6xl mx-auto mt-8 sm:mt-8 mb-20"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.h1
						variants={itemVariants}
						className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight"
					>
						Connect with Friends
						<br />
						<span className="text-primary">in Real Time</span>
					</motion.h1>

					<motion.p
						variants={itemVariants}
						className="text-lg sm:text-xl md:text-2xl max-w-3xl mb-10 leading-relaxed text-muted-foreground"
					>
						Experience seamless, secure, and efficient conversations with
						Milaap. Stay connected anytime, anywhere with our modern chat
						platform.
					</motion.p>

					<motion.div
						variants={itemVariants}
						className="flex flex-col sm:flex-row gap-4 mb-12"
					>
						<Button
							size="lg"
							className="text-lg px-8 py-6"
							nativeButton={false}
							render={
								<Link href="/auth">
									Start Chatting Now
									<IconArrowRight className="ml-2" size={20} />
								</Link>
							}
						></Button>
						<Button
							size="lg"
							variant="outline"
							className="text-lg px-8 py-6"
							nativeButton={false}
							render={<Link href="#features">Learn More</Link>}
						></Button>
					</motion.div>
				</motion.div>

				{/* Features Grid */}
				<motion.section
					id="features"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mb-20"
				>
					{features.map((feature, index) => {
						const IconComponent = feature.icon;
						return (
							<motion.div key={index} variants={itemVariants}>
								<Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg">
									<CardHeader>
										<div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
											<IconComponent
												className="text-primary"
												size={28}
												strokeWidth={2}
											/>
										</div>
										<CardTitle className="text-2xl mb-2">
											{feature.title}
										</CardTitle>
										<CardDescription className="text-base leading-relaxed">
											{feature.desc}
										</CardDescription>
									</CardHeader>
								</Card>
							</motion.div>
						);
					})}
				</motion.section>

				{/* Benefits Section */}
				<motion.section
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="w-full max-w-7xl mb-20"
				>
					<div className="text-center mb-12">
						<Badge variant="outline" className="mb-4">
							<IconStar className="w-4 h-4 mr-2" />
							Why Choose Milaap
						</Badge>
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							Everything You Need
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Built with cutting-edge technology to provide the best messaging
							experience
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
						{benefits.map((benefit, index) => {
							const IconComponent = benefit.icon;
							return (
								<motion.div key={index} variants={itemVariants}>
									<Card className="text-center p-6 hover:shadow-lg h-full transition-all hover:border-primary/50">
										<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
											<IconComponent className="text-primary" size={24} />
										</div>
										<h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
										<p className="text-sm text-muted-foreground">
											{benefit.desc}
										</p>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</motion.section>

				{/* Tech Stack Section */}
				<motion.section
					variants={itemVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="w-full max-w-7xl mb-20"
				>
					<Card>
						<CardHeader className="text-center pb-4">
							<Badge variant="outline" className="mx-auto mb-4">
								<IconTrendingUp className="w-4 h-4 mr-2" />
								Technology Stack
							</Badge>
							<CardTitle className="text-3xl md:text-4xl">
								Built with Modern Technologies
							</CardTitle>
							<CardDescription className="text-lg">
								Milaap is powered by a robust and scalable tech stack
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap justify-center gap-3">
								{[
									{ name: "Next.js", icon: IconBrandNextjs },
									{ name: "Supabase", icon: IconBrandSupabase },
									{ name: "Tailwind CSS", icon: IconBrandTailwind },
									{ name: "TypeScript", icon: IconBrandTypescript },
									{ name: "Zustand", icon: null },
									{ name: "JWT", icon: null },
									{ name: "Framer Motion", icon: null },
								].map((tech, index) => (
									<motion.div
										key={tech.name}
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
									>
										<Badge
											variant="secondary"
											className="px-4 py-2 text-sm font-semibold flex items-center gap-2"
										>
											{tech.icon && <tech.icon size={16} />}
											{tech.name}
										</Badge>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.section>

				{/* CTA Section */}
				<motion.section
					variants={itemVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="w-full max-w-5xl mb-20"
				>
					<Card className="bg-primary/5 border-primary/20">
						<CardHeader className="text-center py-12">
							<CardTitle className="text-3xl md:text-4xl mb-4">
								Ready to Get Started?
							</CardTitle>
							<CardDescription className="text-lg mb-8">
								Join thousands of users already chatting on Milaap
							</CardDescription>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									nativeButton={false}
									render={
										<Link href="/auth">
											Create Account
											<IconArrowRight className="ml-2" size={20} />
										</Link>
									}
								></Button>
								<Button
									size="lg"
									variant="outline"
									nativeButton={false}
									render={<Link href="/auth">Sign In</Link>}
								></Button>
							</div>
						</CardHeader>
					</Card>
				</motion.section>

				{/* Footer */}
				<motion.footer
					className="w-full max-w-7xl py-12 mt-8"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<Separator className="mb-8" />
					<div className="text-center">
						<h3 className="text-xl font-semibold mb-3">About the Developer</h3>
						<p className="text-base max-w-2xl mx-auto text-muted-foreground mb-4">
							Hi, I&apos;m{" "}
							<Link
								href="https://iamabhi.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold text-primary hover:underline underline-offset-2 transition-all"
							>
								Abhishek Kumar
							</Link>
							, a passionate full-stack web developer. I built Milaap to provide
							a seamless messaging experience. Let&apos;s innovate together!
						</p>
					</div>
				</motion.footer>
			</div>
		</div>
	);
}

export default page;
