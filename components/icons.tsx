import { Loader2 } from 'lucide-react';

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => {
    <svg {...props}></svg>;
  },
  spinner: Loader2,
};
