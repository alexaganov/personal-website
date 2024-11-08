"use client";
import { isFullyInView } from "@/utils/dom";
import React, { ComponentPropsWithRef, useEffect, useRef } from "react";
import { useSectionNav } from "./SectionNavProvider";
import clsx from "clsx";

type HomePageSectionsProps = ComponentPropsWithRef<"div"> & {
  sectionClassName?: string;
};

const HomePageSections = ({
  sectionClassName,
  ...props
}: HomePageSectionsProps) => {
  const { setActiveId, sections } = useSectionNav();
  const contentElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionElements = Array.from(
      contentElRef.current?.querySelectorAll("section") || []
    );

    const handleIntersectionObserver: IntersectionObserverCallback = () => {
      const activeSection = sectionElements.find((section) => {
        if (isFullyInView(section)) {
          return true;
        }

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
        );
        const visibleHeightPercentage = visibleHeight / viewportHeight;

        // check if 50% of section is visible because
        return visibleHeightPercentage >= 0.5;
      });

      setActiveId(activeSection?.id);
    };

    const observer = new IntersectionObserver(handleIntersectionObserver, {
      threshold: [0, 1],
      rootMargin: "0px 0px -50% 0px",
    });

    sectionElements.forEach((elem) => observer.observe(elem));

    return () => {
      observer.disconnect();
    };
  }, [setActiveId]);

  return (
    <div ref={contentElRef} {...props}>
      {sections.map(({ name, id, Content }, i) => {
        return (
          <section
            id={id}
            key={id}
            className={clsx("flex flex-col", sectionClassName)}
          >
            <header className="mb-6 flex flex-col gap-2">
              <span
                aria-hidden="true"
                className="text-4xl font-mono text-text-quaternary"
              >
                {`${i + 1}`.padStart(3, "0")}
              </span>
              <h2 className="text-2xl uppercase tracking-wider">{name}</h2>
            </header>

            {Content && <Content />}
          </section>
        );
      })}
    </div>
  );
};

export default HomePageSections;
