import React from 'react';

export default class extends React.Component {

    constructor(props){
        super();
        this.state = {
                recipient: '',
                subject: '',
                body: ''
        }
        this.handleToChange = this.handleToChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)
        this.handleBodyChange = this.handleBodyChange.bind(this)
        //this.onSend = this.onSend.bind(this)
    }

    handleToChange(ev){
        this.setState({ recipient: ev.target.value })
    }

    handleSubjectChange(ev){
        this.setState({ subject: ev.target.value })
    }

    handleBodyChange(ev){
        this.setState({ body: ev.target.value })
    }



    render() {

        return (
            <form  onSubmit = { ()=> this.props.onSend(this.state) }>
                <div className="form-group">
                    <label>To:</label>
                    <input type="text" id="recipient-field" name="recipient" onChange={ this.handleToChange }/>
                </div>

                <div className="form-group">
                    <label>Subject:</label>
                    <input type="text" id="subject-field" name="subject" onChange={ this.handleSubjectChange }/>
                </div>

                <div className="form-group">
                    <label>Body:</label>
                    <textarea id="body-field" name="body" onChange={ this.handleBodyChange }/>
                </div>
                <button type="submit" >Send Message</button>
            </form>
        );
    }

}
