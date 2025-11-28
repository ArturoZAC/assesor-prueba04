interface inputs {
  name: string
  type: string
  value?: string | number | readonly string[] | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const InputsBriefs = (props: inputs): JSX.Element => {
  return (
    <input
      title={props.name}
      className="block w-full pt-4 pb-4 pl-4 pr-4 mt-2 mb-0 ml-0 mr-0 text-base placeholder-gray-400 transition-all border border-black rounded-md outline-none focus:outline-none focus:border-black bg-secondary-900"
      type={props.type}
      name={props.name}
      value={props.value}
      autoComplete="off"
      disabled={props.disabled}
      onChange={props.onChange}
      accept={props.type === 'file' ? '.doc,.docx,application/pdf' : ''}
      onBlur={props.onBlur}
      step={props.type === 'number' ? 1.0 : undefined}
    />
  )
}
