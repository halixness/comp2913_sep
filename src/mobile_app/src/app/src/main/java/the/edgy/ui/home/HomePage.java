package the.edgy.ui.home;

import androidx.annotation.NonNull;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import the.edgy.R;
import the.edgy.ui.activities.ActivitiesFragment;
import the.edgy.ui.profile.ProfileFragment;
import the.edgy.ui.venues.VenuesFragment;

public class HomePage extends AppCompatActivity {


    // Listener for navigation buttons.
    // Every button opens up a new fragment to put in the fragment container.
    private BottomNavigationView.OnNavigationItemSelectedListener navListener =
            new BottomNavigationView.OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                    Fragment selectedFragment = null;

                    // Tag for menu switching later.
                    String fragmentTag = null;

                    // Id changes with different buttons,
                    // so we can detect which button has been clicked.
                    switch (menuItem.getItemId()) {
                        case R.id.navigation_home:
                            selectedFragment = new HomeFragment();
                            fragmentTag = "fragment_home";
                            break;

                        case R.id.navigation_activities:
                            selectedFragment = new ActivitiesFragment();
                            fragmentTag = "fragment_activities";
                            break;

                        case R.id.navigation_venues:
                            selectedFragment = new VenuesFragment();
                            fragmentTag = "fragment_venues";
                            break;

                        case R.id.navigation_profile:
                            selectedFragment = new ProfileFragment();
                            fragmentTag = "fragment_profile";
                            break;
                    }

                    // Replaces the current fragment in the fragment container with the new
                    // fragment corresponding to the button clicked.
                    getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container,
                            selectedFragment).
                            addToBackStack(fragmentTag).
                            commit();

                    // Returning true to highlight the clicked navigation button.
                    return true;
                }


            };

    // Creates the initial home page.
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.frame_layout);

        BottomNavigationView bottom_navigation = findViewById(R.id.bottom_navigation);

        // Listens for the navigation panel buttons to be pressed.
        bottom_navigation.setOnNavigationItemSelectedListener(navListener);

        // Puts the first (home) fragment in the container, so that it appears
        // right after login has been made.
        getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container,
                new HomeFragment()).commit();

    }

    // Pressing a back button while there are existing fragments on top of main one
    // causes the application to go back in fragments.
    // If there are no fragments, the behaviour is default, which is going back in activity levels.
    @Override
    public void onBackPressed() {
        BottomNavigationView bottom_navigation = findViewById(R.id.bottom_navigation);

        Menu navigation_menu = bottom_navigation.getMenu();

        if(getSupportFragmentManager().getBackStackEntryCount() == 0) {
            super.onBackPressed();
        }
        else {
            // Popping the current fragment and showing the previous one.
            getSupportFragmentManager().popBackStack();

            int topOfBackStackIndex = getSupportFragmentManager().getBackStackEntryCount() - 2; // -1 for previous fragment on the stack.

            if (topOfBackStackIndex < 0) {
                // First fragment is always home.
                navigation_menu.findItem(R.id.navigation_home).setChecked(true);
                return;
            }

            FragmentManager.BackStackEntry topOfBackStackFragment = getSupportFragmentManager().
                    getBackStackEntryAt(topOfBackStackIndex);

            String tag = topOfBackStackFragment.getName();

            if (tag != null) {
                switch (tag) {
                    case "fragment_home":
                        navigation_menu.findItem(R.id.navigation_home).setChecked(true);
                        break;

                    case "home_sub_fragment":
                        navigation_menu.findItem(R.id.navigation_home).setChecked(true);
                        break;

                    case "fragment_activities":
                        navigation_menu.findItem(R.id.navigation_activities).setChecked(true);
                        break;

                    case "activities_sub_fragment":
                        navigation_menu.findItem(R.id.navigation_activities).setChecked(true);
                        break;

                    case "fragment_venues":
                        navigation_menu.findItem(R.id.navigation_venues).setChecked(true);
                        break;

                    case "venues_sub_fragment":
                        navigation_menu.findItem(R.id.navigation_venues).setChecked(true);
                        break;

                    case "fragment_profile":
                        navigation_menu.findItem(R.id.navigation_profile).setChecked(true);
                        break;

                    case "profile_sub_fragment":
                        navigation_menu.findItem(R.id.navigation_profile).setChecked(true);
                        break;

                }
            }

        }
    }

    @Override
    public void onPause() {
        super.onPause();  // Always call the superclass method first
    }
}
