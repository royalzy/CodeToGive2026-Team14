import type { LandingContent } from "./types";

export const landingContent: LandingContent = {
    hero: {
        tagline: "Hong Kong · Est. 2014",
        titleLine1: "Every Life is",
        titleAccent: "Full of Potential",
        subtitle:
            "Love 21 Foundation empowers the Down syndrome and autistic community in Hong Kong through sport, nutrition, arts, and holistic support.",
        ctaPrimary: "Meet the Community",
        ctaSecondary: "Volunteer With Us",
        stats: [
            { value: "200+", label: "Community members" },
            { value: "10+", label: "Years in HK" },
            { value: "52", label: "Programmes/year" },
        ],
        images: [
            { src: "/images/sports-session.jpg", alt: "Love 21 community sports session" },
            { src: "/images/community-performance.jpg", alt: "Community performance" },
            { src: "/images/crystal-performing.jpg", alt: "Crystal performing" },
        ],
    },

    mythQuiz: {
        eyebrow: "Test Yourself",
        title: "Myth or Fact?",
    },

    whatWeDo: {
        eyebrow: "Our Community",
        title: "What We Do",
        description:
            "Five pillars of support designed to help every member of our community grow, connect, and thrive.",
        pillars: [
            {
                id: "sports",
                icon: "Medal",
                title: "Sport & Athletics",
                description:
                    "We run weekly multi-sport sessions — swimming, basketball, football, and dance — designed for all ability levels. Sport builds confidence, coordination, and lifelong friendships.",
                image: "/images/sports-session.jpg",
            },
            {
                id: "nutrition",
                icon: "Apple",
                title: "Nutrition & Wellness",
                description:
                    "Our nutrition programme teaches families and members about healthy eating habits tailored to the unique needs of people with Down syndrome and autism.",
                image: "/images/community-performance.jpg",
            },
            {
                id: "arts",
                icon: "Drama",
                title: "Arts & Performance",
                description:
                    "From drama to music to visual art, our creative programmes unlock self-expression and help members communicate, grow, and shine on stage.",
                image: "/images/crystal-performing.jpg",
            },
            {
                id: "community",
                icon: "Handshake",
                title: "Community & Belonging",
                description:
                    "Peer support groups, family workshops, and social events build a network where no one feels alone. Our community in Hong Kong is growing every month.",
                image: "/images/community-performance.jpg",
            },
            {
                id: "holistic",
                icon: "Sprout",
                title: "Holistic Development",
                description:
                    "We partner with therapists, educators, and healthcare professionals to support the whole person — body, mind, and spirit — across every stage of life.",
                image: "/images/sports-session.jpg",
            },
        ],
    },

    learn: {
        eyebrow: "Learn",
        title: "Understanding Autism & Down Syndrome",
        description:
            "Two neurodevelopmental conditions, two extraordinary communities. Choose a topic below to explore the science, bust the myths, and discover how Love 21 supports every member to thrive.",
        topics: [
            { id: "autism", icon: "Puzzle", title: "Learn About Autism" },
            { id: "ds", icon: "Dna", title: "Learn About Down Syndrome" },
        ],
    },

    autismSection: {
        eyebrow: "Understanding Autism",
        title: "Learn About Autism",
        description:
            "Autism is not a puzzle to be solved — it's a different way of experiencing the world. Here's what science and lived experience teach us.",
        mythBust: {
            title: "Common Myth Busted",
            body: "Vaccines do not cause autism. This claim originated from a 1998 study that was retracted due to fraud. Dozens of large-scale studies involving millions of children have confirmed there is absolutely no link.",
        },
        facts: [
            {
                title: "What is Autism?",
                icon: "Puzzle",
                accent: "blue",
                short: "A spectrum of difference",
                detail:
                    "Autism Spectrum Disorder (ASD) is a neurodevelopmental condition that affects how people perceive and interact with the world. It is a spectrum — meaning every autistic person is unique, with their own strengths, challenges, and ways of experiencing life.",
                stats: [
                    { label: "Global prevalence", value: "~1 in 100 people" },
                    { label: "Spectrum range", value: "Vast & varied" },
                    { label: "Diagnosis age", value: "Often 2–4 years" },
                    { label: "Ratio", value: "4× more in males*" },
                ],
                note: "*though diagnosis rates in females are rising as awareness grows.",
            },
            {
                title: "Sensory Experience",
                icon: "Sparkles",
                accent: "teal",
                short: "The world feels different",
                detail:
                    "Many autistic people experience sensory input — sound, light, touch, smell — more intensely or differently than neurotypical people. This can be both a gift (heightened perception and focus) and a challenge in everyday environments.",
                stats: [
                    { label: "Sensory differences", value: "In ~90% of autistic people" },
                    { label: "Hypersensitivity", value: "Over-responsive to input" },
                    { label: "Hyposensitivity", value: "Under-responsive to input" },
                    { label: "Stimming", value: "Self-regulation tool" },
                ],
                note: "Stimming (repetitive movement) is a healthy self-regulating behaviour, not something to suppress.",
            },
            {
                title: "Strengths & Gifts",
                icon: "Star",
                accent: "yellow",
                short: "Unique cognitive profiles",
                detail:
                    "Autism often comes with extraordinary strengths: exceptional memory, pattern recognition, deep focus on areas of interest, creative thinking, and an honest, direct communication style that many people find refreshing.",
                stats: [
                    { label: "Pattern recognition", value: "Often exceptional" },
                    { label: "Focus depth", value: "Intense & sustained" },
                    { label: "Memory", value: "Detail-oriented" },
                    { label: "Honesty", value: "Authentic & direct" },
                ],
                note: "Many autistic people credit their condition for their greatest achievements.",
            },
            {
                title: "Support & Inclusion",
                icon: "Heart",
                accent: "red",
                short: "Thriving with the right support",
                detail:
                    "With the right support — early intervention, inclusive education, and a community that celebrates difference — autistic people thrive. Love 21 Foundation is building that community in Hong Kong every day.",
                stats: [
                    { label: "Early intervention", value: "Makes a huge difference" },
                    { label: "Employment", value: "~20% in paid work*" },
                    { label: "Key support", value: "Community & belonging" },
                    { label: "Our approach", value: "Strengths-based" },
                ],
                note: "*We work to change this — autistic people can contribute enormously to the world.",
            },
        ],
    },

    dsSection: {
        eyebrow: "Understanding Down Syndrome",
        title: "Learn About Down Syndrome",
        description:
            "Down syndrome is the most common chromosomal condition — and one of the most misunderstood. Let's change that together.",
        why21: {
            title: "Why We Are Love 21",
            body: 'The "21" in our name honours chromosome 21 — the extra chromosome that makes our community members who they are. It\'s not a deficit. It\'s what makes them extraordinary.',
        },
        facts: [
            {
                title: "What is Down Syndrome?",
                icon: "Dna",
                accent: "yellow",
                short: "An extra chromosome",
                detail:
                    "Down syndrome (Trisomy 21) occurs when a person is born with a third copy of chromosome 21. It is the most common chromosomal condition worldwide, affecting approximately 1 in 700 births. It is not a disease — it is a natural variation in human genetics.",
                stats: [
                    "1 in 700 births",
                    "Most common chromosomal variation",
                    "Present since birth",
                    "Not inherited in most cases",
                ],
            },
            {
                title: "Physical Characteristics",
                icon: "Heart",
                accent: "red",
                short: "Recognised features",
                detail:
                    "People with Down syndrome may share some physical characteristics — almond-shaped eyes, a flatter facial profile, smaller ears — but each person is first and foremost an individual. They resemble their family members more than they resemble each other.",
                stats: [
                    "Almond-shaped eyes",
                    "Lower muscle tone (hypotonia)",
                    "Single palmar crease",
                    "Shorter stature",
                ],
            },
            {
                title: "Health & Development",
                icon: "Stethoscope",
                accent: "teal",
                short: "Managing health proactively",
                detail:
                    "People with Down syndrome may experience certain health conditions more frequently, including congenital heart defects, thyroid conditions, and hearing or vision differences. With regular health monitoring and early intervention, people with DS live long, healthy, fulfilling lives.",
                stats: [
                    "40–50% have heart differences",
                    "Life expectancy now 60+",
                    "Early intervention key",
                    "Ongoing health monitoring",
                ],
            },
            {
                title: "Abilities & Potential",
                icon: "Rocket",
                accent: "blue",
                short: "No limits on potential",
                detail:
                    "People with Down syndrome learn, grow, work, fall in love, create art, compete in sport, and contribute meaningfully to their communities. Intellectual development varies widely — what every person shares is the capacity for joy, connection, and achievement.",
                stats: [
                    "Many live independently",
                    "Athletes, artists, advocates",
                    "Meaningful employment",
                    "Rich social & family lives",
                ],
            },
        ],
    },

    quiz: {
        eyebrow: "Test Your Knowledge",
        title: "How Much Do You Know?",
        description:
            "Six questions about Down syndrome and autism. Every answer teaches you something new.",
        questions: [
            {
                question: "Which chromosome is associated with Down syndrome?",
                options: ["Chromosome 18", "Chromosome 21", "Chromosome X", "Chromosome 13"],
                answer: 1,
                fact: 'Down syndrome (Trisomy 21) occurs when there is an extra copy of chromosome 21. This is why Love 21 Foundation chose "21" — celebrating the extra chromosome that makes our community unique.',
                topic: "Down Syndrome",
            },
            {
                question: "Approximately how many people worldwide are autistic?",
                options: ["1 in 1,000", "1 in 500", "1 in 100", "1 in 50"],
                answer: 2,
                fact: "Approximately 1 in 100 people are autistic globally — that's over 78 million people. Awareness and inclusion matter enormously.",
                topic: "Autism",
            },
            {
                question: 'What does "neurodiversity" mean?',
                options: [
                    "A medical diagnosis",
                    "The natural variation in human brain function",
                    "A type of therapy",
                    "A genetic condition",
                ],
                answer: 1,
                fact: "Neurodiversity recognizes that conditions like autism and Down syndrome are natural variations of the human genome — not defects to be fixed, but differences to be celebrated and supported.",
                topic: "Both",
            },
            {
                question: 'What is "stimming" in the context of autism?',
                options: [
                    "A type of medication",
                    "Repetitive self-stimulating behaviours that help with self-regulation",
                    "A communication system",
                    "A diagnostic test",
                ],
                answer: 1,
                fact: "Stimming (self-stimulatory behaviour) includes actions like hand-flapping, rocking, or repeating words. It's a healthy coping mechanism that helps autistic people regulate sensory input and emotions.",
                topic: "Autism",
            },
            {
                question: "What is the approximate life expectancy for people with Down syndrome today?",
                options: ["Under 30 years", "30–40 years", "40–50 years", "Over 60 years"],
                answer: 3,
                fact: "Thanks to advances in medical care and inclusion, people with Down syndrome now live well into their 60s and beyond. This is a triumph of medicine, advocacy, and community support.",
                topic: "Down Syndrome",
            },
            {
                question: "Which statement about autism is TRUE?",
                options: [
                    "Autism is caused by vaccines",
                    "All autistic people have the same traits",
                    "Autism is a spectrum with enormous variation",
                    "Autism only affects children",
                ],
                answer: 2,
                fact: 'Autism is a wide spectrum — two autistic people can have completely different experiences, strengths, and support needs. The phrase "if you\'ve met one autistic person, you\'ve met one autistic person" captures this beautifully.',
                topic: "Autism",
            },
        ],
        results: [
            {
                threshold: 5,
                icon: "Star",
                title: "Inclusion Champion!",
                message:
                    "You have exceptional knowledge. Share what you know — awareness changes lives.",
            },
            {
                threshold: 3,
                icon: "Heart",
                title: "Growing Awareness",
                message:
                    "Great foundation. Explore our learn sections above to discover more.",
            },
            {
                threshold: 0,
                icon: "Sprout",
                title: "Just Getting Started",
                message:
                    "Every journey starts somewhere. Explore the sections above and try again!",
            },
        ],
    },

    impact: {
        eyebrow: "Our Impact",
        title: "Love 21 by the Numbers",
        stats: [
            { icon: "Medal", value: "200+", label: "Members in our community" },
            { icon: "Calendar", value: "52", label: "Programmes run each year" },
            { icon: "Trophy", value: "15+", label: "Sports & activities offered" },
            { icon: "Handshake", value: "80+", label: "Active volunteers" },
            { icon: "Heart", value: "10+", label: "Years serving Hong Kong" },
            { icon: "Globe", value: "3", label: "Pillars: Sport, Nutrition, Holistic" },
        ],
        mission: {
            eyebrow: "Our Mission",
            title: "Building an Inclusive Hong Kong, One Life at a Time.",
            description:
                "We believe sport has the power to transform lives. Our approach combines physical activity, nutrition education, and holistic community support to unlock the potential of every person with Down syndrome or autism in Hong Kong.",
            pillars: [
                { icon: "Medal", title: "Sport", description: "Building confidence and coordination" },
                { icon: "Apple", title: "Nutrition", description: "Healthy habits for the whole family" },
                { icon: "Palette", title: "Arts", description: "Creative expression and communication" },
                { icon: "Handshake", title: "Community", description: "Belonging and peer support" },
            ],
        },
    },

    cta: {
        eyebrow: "Join Us",
        title: "Be Part of the Story",
        description:
            "Every member of our community has a role to play. Whether you volunteer your time, donate to support our programmes, or simply spread the word — you make a difference.",
        volunteer: {
            icon: "HeartHandshake",
            title: "Volunteer With Us",
            description:
                "Join our team of 80+ volunteers and make a real impact every week. Help with sports sessions, events, mentoring, and more. No special skills required — just a big heart.",
            roles: [
                "Sports session support",
                "Event organisation",
                "Arts & music facilitation",
                "Fundraising & advocacy",
            ],
            cta: "Apply to Volunteer",
            route: "/volunteer",
        },
        donate: {
            icon: "Heart",
            title: "Make a Donation",
            description:
                "Your donation directly funds sports equipment, nutrition programmes, arts workshops, and community events. Every dollar helps someone find their potential.",
            amounts: ["HK$100", "HK$250", "HK$500"],
            cta: "Donate Now",
            route: "/donate",
        },
        tertiary: {
            text: "Want to learn more about our programmes or partner with us?",
            label: "Visit love21foundation.com",
            href: "https://love21foundation.com",
        },
    },
};
