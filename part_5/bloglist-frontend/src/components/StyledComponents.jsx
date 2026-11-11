import styled from 'styled-components'

export const Button = styled.button`
  background-color: #0b97dd;
  color: white;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid;
  border-radius: 3px;
`
export const Input = styled.input`
  margin: 0.25em;
  width: 200px;  
`

export const Page = styled.div`
  padding: 1em;
`
export const Navigation = styled.div`
  background: #0b97dd;
  padding: 1em;
  color: white;
`
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
`
export const ErrorNotification = styled.div`
    color: #cc0000;
    background: #eeaaaa;
    font-size: 20px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
`
export const SuccessNotification = styled.div`
    color: #37af37;
    background: #b6e2b6;
    font-size: 20px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
`
export const BlogPage = styled.div`
    background: #e6f7ff;
    margin-top: 5px;
    padding-top: 10px;
    padding-left: 2px;
    border: solid white 1px;
    borderWidth: 1px;
    marginBottom: 5px;
`