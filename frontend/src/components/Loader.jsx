const Loader = ({ text = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin"></div>
      <p className="text-text-secondary text-sm">{text}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-primary-bg flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-12">{content}</div>
}

export default Loader
