import type { ChangeEvent } from 'react'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}

export function TextField(props: TextFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    props.onChange(event.target.value)
  }

  return (
    <label className="formField">
      <span className="formLabel">{props.label}</span>
      {props.multiline ? (
        <textarea className="formTextarea" value={props.value} onChange={handleChange} rows={4} />
      ) : (
        <input className="formInput" value={props.value} onChange={handleChange} />
      )}
    </label>
  )
}

interface EntryActionsProps {
  onAdd?: () => void
  onRemove?: () => void
}

export function EntryActions(props: EntryActionsProps) {
  return (
    <div className="entryActions">
      {props.onAdd ? <button type="button" onClick={props.onAdd}>Add</button> : null}
      {props.onRemove ? <button type="button" onClick={props.onRemove}>Delete</button> : null}
    </div>
  )
}