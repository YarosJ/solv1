import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { VelocityComponent } from 'velocity-react';
import TestimonialsWindow from './TestimonialsWindow';
import Carousel from '../../Carousel';
import maleLogo from '../../../../images/male1.png';
import femaleLogo from '../../../../images/female1.png';
import styles from './TestimonialsCarousel.less';

class GenderLogo extends Component {
  render() {
    return (
      <img
        onClick={
          () => {
            if (this.props.onClick) this.props.onClick(this.props.children);
          }
        }
        src={
          this.props.children === 'male' ? maleLogo : femaleLogo
        }
      />
    );
  }
}

class IconSwitcher extends Component {
  constructor(props) {
    super(props);
    this.transitionTime = 0;
  }

  closeWindow(target) {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(target).parentNode);
  }

  render() {
    return (
      <VelocityComponent animation={{ opacity: 1 }} duration={this.transitionTime}>
        <div
          className={`${styles.iconSwitcher} ${styles.velocityElement}`}
          style={{
            top: `${this.props.top}px`,
            left: `${this.props.left}px`,
          }}>
          <GenderLogo onClick={(e) => {
            this.props.onUpdateSlide({ gender: e }, this.props._id);
            this.closeWindow(this);
          }}>
            female
          </GenderLogo>
          <GenderLogo onClick={(e) => {
            this.props.onUpdateSlide({ gender: e }, this.props._id);
            this.closeWindow(this);
          }}>
            male
          </GenderLogo>
          <div className={styles.triangle} />
          <span
            className={styles.cls}
            onClick={() => {
              this.closeWindow(this);
            }}>
            x
          </span>
        </div>
      </VelocityComponent>
    );
  }
}

class TestimonialsSwitcher extends Component {
  addSelecter(e) {
    e.preventDefault();
    this.props.onClick(e);

    const client = e.currentTarget.getBoundingClientRect();

    ReactDOM.render(
      <IconSwitcher
        _id={this.props._id}
        onUpdateSlide={this.props.onUpdateSlide}
        left={document.body.scrollLeft + client.left - 1}
        top={document.body.scrollTop + client.top - 57}
      />,
      document.getElementById('modal'),
    );
  }

  render() {
    const key = this.props['data-key'];
    return (
      <li
        className={`${styles.testimonialsItem} ${this.props.className}`}
        onClick={this.props.onClick}
        onContextMenu={(e) => {
          if (this.props.canChange) this.addSelecter(e);
        }}
        key={key}
        data-key={key}>
        <GenderLogo>
          { this.props.children.gender }
        </GenderLogo>
        <div className={styles.testimonialsCircle} />
        <div className={styles.testimonialsRectangle}>
          <div className={styles.testimonialsTriangle} />
        </div>
      </li>
    );
  }
}

class SlideElement extends Component {
  constructor(props) {
    super(props);
    this.state = { edit: false, target: null };
  }

  edit = (e) => {
    if (this.props.canChange) this.setState({ edit: true, target: e.currentTarget });
  }

  save = () => {
    this.props.onUpdateSlide({ [this.props.name]: this.state.target.getElementsByTagName('p')[0].innerText }, this.props._id);
    this.setState({ edit: false });
  }

  cancel = () => {
    this.state.target.getElementsByTagName('p')[0].innerText = this.props.children;
    this.setState({ edit: false });
  }

  defaultRender() {
    const Tag = this.props.tag;
    return (
      <Tag className={this.props.name} onClick={this.edit.bind(this)}>
        <p>
          { this.props.children }
        </p>
      </Tag>
    );
  }

  editRender() {
    const Tag = this.props.tag;
    return (
      <Tag className={this.props.name}>
        <p
          className={styles.activeField}
          contentEditable="true"
          suppressContentEditableWarning="true">
          { this.props.children }
        </p>
        <div className={styles.editControls}>
          <button className="edit-ok" onClick={this.save}>
            OK
          </button>
          <button className="edit-cancel" onClick={this.cancel}>
            CANCEL
          </button>
        </div>
      </Tag>
    );
  }

  render() {
    if (this.state.edit) {
      return this.editRender();
    }
    return this.defaultRender();
  }
}

class TestimonialsSlide extends Component {
  render() {
    return (
      <li className={styles.slide}>
        <div className={styles.container} ref="field">
          <SlideElement
            _id={this.props._id}
            name="title"
            tag="h1"
            onUpdateSlide={this.props.onUpdateSlide}
            canChange={this.props.canChange}>
            { this.props.children.title }
          </SlideElement>
          <SlideElement
            _id={this.props._id}
            name="body"
            tag="h2"
            onUpdateSlide={this.props.onUpdateSlide}
            canChange={this.props.canChange}>
            { this.props.children.body }
          </SlideElement>
          <SlideElement
            _id={this.props._id}
            name="autor"
            tag="h4"
            onUpdateSlide={this.props.onUpdateSlide}
            canChange={this.props.canChange}>
            { this.props.children.autor }
          </SlideElement>
        </div>
      </li>
    );
  }
}

class TestimonialsCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  componentWillMount() {
    this.props.onGetSlides(this);
    if (this.props.testimonialsSlides) this.setState({ canChange: true });
  }

  checkAdmin() {
    if (this.props.session.role) {
      if (this.props.session.role.match(/admin/gi)) {
        return true;
      }
    }
    return false;
  }

  add() {
    ReactDOM.render(
      <TestimonialsWindow addSlide={this.props.onAddSlide.bind(this)}>
        { { male: maleLogo, female: femaleLogo } }
      </TestimonialsWindow>,
      document.getElementById('modal'),
    );
  }

  remove() {
    this.props.onRemoveSlide(this.props.testimonialsSlides[this.state.current]._id, this.state.current);
    this.props.onGetSlides();
  }

  componentDidUpdate() {
    if (this.carousel) this.carousel.recountLength();
  }

  render() {
    return (
      <div
        className={styles.testimonials}
        onClick={(e) => {
          if (document.getElementById('modal').hasChildNodes() && !e.target.className.match(/add-item/)) {
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(document.getElementById('modal').lastChild).parentNode);
          }
        }}>
        <hr />
        <div className={styles.testimonialsSlider}>
          { this.checkAdmin()
            && (
            <div
              className={`${styles.controlTestimonialsItem} delete-item`}
              onClick={this.remove.bind(this)}>
              -
            </div>
            ) }
          { this.checkAdmin()
            && (
            <div className={`${styles.controlTestimonialsItem} add-item`} onClick={this.add.bind(this)}>
              +
            </div>
            ) }
          <Carousel
            switcher={TestimonialsSwitcher}
            slide={TestimonialsSlide}
            selectedClassName={styles.selectedSwitcher}
            itemsClassName={styles.items}
            viewportClassName={styles.viewport}
            requiredId
            getCurrent={current => this.state.current = current}
            onUpdateSlide={this.props.onUpdateSlide}
            canChange={this.checkAdmin()}
            onRef={ref => (this.carousel = ref)}>
            { this.props.testimonialsSlides }
          </Carousel>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    testimonialsSlides: state.testimonialsSlides,
    session: state.session,
  }),

  dispatch => ({

    onGetSlides: () => {
      axios.get('/testimonials')
        .then((response) => {
          dispatch({ type: 'SET_TESTIMONIALS_SLIDES', payload: response.data });
        }).catch((error) => {
          console.log(error);
        });
    },

    onAddSlide: (slide) => {
      axios.post('/testimonials/', slide)
        .then((response) => {
          dispatch({ type: 'ADD_TESTIMONIALS_SLIDE', payload: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onUpdateSlide: (slide, _id) => {
      axios.put(`/testimonials/${_id}`, slide)
        .then((response) => {
          dispatch({ type: 'UPDATE_TESTIMONIALS_SLIDE', payload: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onRemoveSlide: (_id, id) => {
      axios.delete(`/testimonials/${_id}`)
        .then((response) => {
          dispatch({ type: 'REMOVE_TESTIMONIALS_SLIDE', payload: id });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }),
)(TestimonialsCarousel);
