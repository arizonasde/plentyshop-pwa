export type TextCardProps = {
  name: string;
  type: string;
  content: TextCardContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type TextCardContent = {
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
    color?: string;
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
    alignment?: 'left' | 'center' | 'right';
  };
  layout: {
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    fullWidth?: boolean;
    // Arizona: 'center' centres the text vertically in its grid column (e.g. next to a large image)
    verticalAlignment?: 'top' | 'center';
  };
};

export type TextCardFormProps = {
  uuid?: string;
};

export type ButtonVariant = 'primary' | 'secondary';
export type TextAlign = 'left' | 'center' | 'right';
