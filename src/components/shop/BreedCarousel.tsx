"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BREEDS } from "@/lib/shop/constants";

type Props = {
  selected?: string;
  onSelect: (breed: string) => void;
};

export function BreedCarousel({ selected, onSelect }: Props) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-lg font-bold text-white md:text-xl">
        Shop by breed
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Curated picks for your furry friend
      </p>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect("")}
          className={`flex shrink-0 flex-col items-center gap-2 ${
            !selected ? "opacity-100" : "opacity-60"
          }`}
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-xs font-semibold md:h-20 md:w-20 ${
              !selected
                ? "border-sky-brand bg-sky-brand/20 text-sky-brand"
                : "border-slate-600 bg-slate-800 text-slate-300"
            }`}
          >
            All
          </span>
          <span className="text-xs font-medium text-slate-300">All breeds</span>
        </motion.button>
        {BREEDS.map((breed) => {
          const active = selected === breed.name;
          return (
            <motion.button
              key={breed.slug}
              type="button"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(breed.name)}
              className={`flex shrink-0 flex-col items-center gap-2 ${
                active ? "opacity-100" : "opacity-75 hover:opacity-100"
              }`}
            >
              <span
                className={`relative h-16 w-16 overflow-hidden rounded-full border-2 md:h-20 md:w-20 ${
                  active ? "border-sky-brand shadow-[0_0_24px_rgba(56,189,248,0.4)]" : "border-slate-600"
                }`}
              >
                <Image
                  src={breed.image}
                  alt={breed.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </span>
              <span className="max-w-[72px] truncate text-xs font-medium text-slate-300">
                {breed.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
