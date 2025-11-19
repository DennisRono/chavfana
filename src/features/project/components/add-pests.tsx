import React from 'react'

interface AddPestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  speciesid: string
  eventid: string
}

const AddPestsDialog = ({
  open,
  onOpenChange,
  onSuccess,
  speciesid,
  eventid,
}: AddPestsDialogProps) => {
  return <div>AddPestsDialog</div>
}

export default AddPestsDialog
