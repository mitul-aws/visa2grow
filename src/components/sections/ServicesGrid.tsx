import { SERVICES } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceCard } from './ServiceCard';

export function ServicesGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {SERVICES.map((service, i) => (
        <Reveal as="li" key={service.slug} delay={(i % 4) * 70}>
          <ServiceCard service={service} index={i} />
        </Reveal>
      ))}
    </ul>
  );
}
