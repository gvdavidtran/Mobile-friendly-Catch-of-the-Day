import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from '../base';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCart from '@material-ui/icons/ShoppingCart'
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListIcon from '@material-ui/icons/List';
import StoreIcon from '@material-ui/icons/Store';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -20,
    marginRight: 20,
  },
  cartButton:{
    marginLeft: 20,
    marginRight: -20,
  },
  bottomNav: {
    width: "100%",
    // height: 70,
    position: 'fixed',
    bottom: 0,
    padding: 0,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
};

class App extends React.Component {
  state = {
    fishes: {},
    order: {},
    mobileOpen: false,
    value: 0,
  }

  static propTypes = {
    match: PropTypes.object,
  }

  componentDidMount() {
    const { params } = this.props.match;
    // first reinstate our localStorage
    const localStorageRef = localStorage.getItem(params.storeId);
    if(localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`${params.storeId}/fishes`, {
      context: this,
      state:'fishes',
    });
  }

  componentDidUpdate() {
    localStorage.setItem(
      this.props.match.params.storeId, 
      JSON.stringify(this.state.order)
    );
  }

  // Cleanup memory when user leaves the store
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addFish = (fish) => {
    // 1. take a copy of the existing state
    const fishes = {...this.state.fishes};
    // 2. add our new fish to that fishes variable
    fishes[`fish${Date.now()}`] = fish;
    // 3. Set the nee fishes obect to state
    this.setState({
      fishes: fishes
    });
  }

  updateFish = ( key, updatedFish ) => {
    // 1. Take a copy of the current state
    const fishes = { ...this.state.fishes };
    // 2. Update that state
    fishes[key] = updatedFish;
    // 3. Set that to state
    this.setState({ fishes});
  }

  deleteFish = (key) => {
    // 1. take a copy of state
    const fishes = { ...this.state.fishes };
    // 2. update the state
    fishes[key] = null;
    // 3. update state
    this.setState({ fishes });
  }

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  }

  addToOrder = key => {
    // 1. Take a copy of state
    const order = { ...this.state.order };
    // 2. Either add to the order, or update the number in our order
    order[key] = order[key] + 1 || 1;
    // 3. Call setstate to update our state
    this.setState({ order: order });
  }
  removeFromOrder = key => {
    // 1. take a copy of order
    const order = { ...this.state.order };
    // 2. remove item from order
    delete order[key];
    // 3. update the state
    this.setState({ order });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }
  handleBottomNavChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { classes } = this.props;

    return (
      <div className="catch-of-the-day">
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex} >
              <Header tagline="Fresh Seafood Market" />
            </Typography>
            <IconButton className={classes.cartButton} color="inherit" aria-label="Menu" onClick={this.handleDrawerToggle}>
              <ShoppingCart />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="right"
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
          >
            <Order 
              fishes={this.state.fishes} 
              order={this.state.order} 
              removeFromOrder={this.removeFromOrder} 
            />
          </Drawer>
        </Hidden>

        <Hidden smDown implementation="css">
          <Drawer 
            variant="permanent"
            open
            anchor="right"
          >
            <Order 
              fishes={this.state.fishes} 
              order={this.state.order} 
              removeFromOrder={this.removeFromOrder} 
            />
          </Drawer>
        </Hidden>

        {this.state.value === 0 && 
        <div className="menu">
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)}
          </ul>
        </div>
        }

        {this.state.value === 1 && 
        <Inventory 
          addFish={this.addFish} 
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId} 
        />
        }
        
        <BottomNavigation
          value={this.state.value}
          onChange={this.handleBottomNavChange}
          showLabels
          className={this.props.classes.bottomNav}
        >
          <BottomNavigationAction label="Menu" icon={<ListIcon />} />
          <BottomNavigationAction label="Inventory" icon={<StoreIcon />} />
        </BottomNavigation>
          
      </div>
    );
  }
}

export default withStyles(styles)(App);
