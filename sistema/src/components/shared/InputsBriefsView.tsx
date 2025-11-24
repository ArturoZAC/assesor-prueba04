
interface inputs {
  name: string
  type: string
  value: string | number | readonly string[] | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputsBriefsView = (props: inputs): JSX.Element => {
  return (
    <input
      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
      type={props.type}
      name={props.name}
      value={props.value}
      autoComplete="off"
      onChange={props.onChange}
      onBlur={props.onBlur}
      disabled
    />
  )
}
