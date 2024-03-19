type Props = {
  params: {
    collegeId: string;
  };
};

export default function Page({ params }: Props) {
  return <>College- {params.collegeId}</>;
}
