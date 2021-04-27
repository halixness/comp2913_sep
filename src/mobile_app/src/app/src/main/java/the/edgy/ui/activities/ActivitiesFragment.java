package the.edgy.ui.activities;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import the.edgy.R;
import the.edgy.ui.venues.ShowVenuesFragment;

public class ActivitiesFragment extends Fragment {

    private Button activities;

    // Show venues button opens a new fragment which shows possible venues to be booked.
    private Button.OnClickListener buttonListener = new
            Button.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Fragment showActivitiesFragment = new ShowActivitiesFragment();

                    // Replaces current fragment with a new fragment.
                    /*
                     *  @Note: the new fragment is a 'sub_fragment' of its parent,
                     *         and hence will have a tag of the form:
                     *
                     *         '<parent>_sub_fragment'
                     */
                    getActivity().getSupportFragmentManager().beginTransaction().
                            replace(R.id.fragment_container, showActivitiesFragment, "activities_sub_fragment").
                            addToBackStack("activities_sub_fragment").
                            commit();
                }
            };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_activities, container, false);

        // Create a button.
        activities = (Button) root.findViewById(R.id.show_activities);

        activities.setOnClickListener(buttonListener);

        return root;

    }
}