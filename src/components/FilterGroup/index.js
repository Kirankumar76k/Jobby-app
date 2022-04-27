import './index.css'

const FilterGroup = props => {
  const renderSalaryRangeFiltersList = () => {
    const {salaryRangesList, changeRange} = props
    return salaryRangesList.map(range => {
      const onClickRangeItem = () => changeRange(range.salaryRangeId)
      const {label} = range
      return (
        <li className="range-item" key={range.salaryRangeId}>
          <input
            type="radio"
            id="rangeId"
            value={range.salaryRangeId}
            className="input-radio"
            onClick={onClickRangeItem}
          />
          <label htmlFor="rangeId" className="label">
            {label}
          </label>
        </li>
      )
    })
  }

  const renderEmpTypeFiltersList = () => {
    const {employmentTypesList, changeEmpType} = props
    return employmentTypesList.map(eachType => {
      const onClickEmpTypeItem = () => changeEmpType(eachType.employmentTypeId)
      const {label} = eachType
      return (
        <li className="range-item" key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            id="empTypeId"
            className="input-check"
            onClick={onClickEmpTypeItem}
            value={label}
          />
          <label htmlFor="empTypeId" className="label">
            {label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryRangeFilters = () => (
    <div>
      <h1 className="range-heading">Salary Range</h1>
      <ul className="range-list">{renderSalaryRangeFiltersList()}</ul>
    </div>
  )

  const renderEmpTypeFilters = () => (
    <div>
      <h1 className="range-heading">Type of Employment</h1>
      <ul className="range-list">{renderEmpTypeFiltersList()}</ul>
    </div>
  )

  return (
    <div className="filters-group-container">
      {renderEmpTypeFilters()}
      {renderSalaryRangeFilters()}
    </div>
  )
}
export default FilterGroup
