"use client";
import {FC, useRef} from "react";
import {motion, useScroll, useTransform} from "motion/react";

interface iCardItem {
	src: string;
}

interface iCardProps extends iCardItem {
	i: number;
    progress: any;
    range: [number, number];
}

const Card: FC<iCardProps> = ({
	src,
    progress,
    range
}) => {
    const scale = useTransform(progress, range, [1, 0.95]);
    
	return (
		<div className="h-full w-full flex items-center justify-center p-2">
			<motion.div
				style={{ 
                    scale,
                }}
				className="relative w-full h-[35vh] md:h-[48vh] max-w-[1000px] shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] flex items-center justify-center mx-auto"
			>
                <img
                    className="max-w-full max-h-full object-contain mx-auto"
                    src={src}
                    alt="Vehicle"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/media/image1.jpeg";
                    }}
                />
			</motion.div>
		</div>
	);
};

interface iCardSlideProps {
	items: iCardItem[];
}

export const CardsParallax: FC<iCardSlideProps> = ({items}) => {
    const container = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

	return (
		<div 
            ref={container}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-[40vh] md:h-[55vh] relative gap-6 mt-4"
        >
			{items.map((item, i) => {
				return (
                    <div key={`p_${i}`} className="snap-center flex-none w-full h-full flex items-center justify-center">
                        <Card 
                            {...item} 
                            i={i} 
                            progress={scrollXProgress} 
                            range={[i / items.length, (i + 1) / items.length]}
                        />
                    </div>
                );
			})}
		</div>
	);
};
